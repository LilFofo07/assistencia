// Device detection and communication utilities
export interface RealDevice {
  id: string
  name: string
  model: string
  os: string
  version: string
  buildNumber: string
  serialNumber: string
  imei: string
  batteryLevel: number
  batteryHealth: number
  storageUsed: number
  storageTotal: number
  ramUsed: number
  ramTotal: number
  cpuUsage: number
  temperature: number
  bootloaderLocked: boolean
  rootStatus: boolean
  securityPatch: string
  brand: string
  chipset: string
  screenResolution: string
  port?: SerialPort
  connectionType: "usb" | "adb" | "fastboot"
}

export class DeviceDetector {
  private connectedDevices: Map<string, RealDevice> = new Map()
  private onDeviceConnected?: (device: RealDevice) => void
  private onDeviceDisconnected?: (deviceId: string) => void

  constructor() {
    this.initializeDetection()
  }

  private async initializeDetection() {
    // Check if Web Serial API is supported
    if ("serial" in navigator) {
      navigator.serial.addEventListener("connect", this.handleSerialConnect.bind(this))
      navigator.serial.addEventListener("disconnect", this.handleSerialDisconnect.bind(this))

      // Check for already connected devices
      const ports = await navigator.serial.getPorts()
      for (const port of ports) {
        await this.detectDevice(port)
      }
    }

    // Start ADB detection
    this.startADBDetection()
  }

  private async handleSerialConnect(event: Event) {
    const port = event.target as SerialPort
    await this.detectDevice(port)
  }

  private handleSerialDisconnected(event: Event) {
    const port = event.target as SerialPort
    // Find and remove disconnected device
    for (const [id, device] of this.connectedDevices) {
      if (device.port === port) {
        this.connectedDevices.delete(id)
        this.onDeviceDisconnected?.(id)
        break
      }
    }
  }

  private async detectDevice(port: SerialPort) {
    try {
      await port.open({ baudRate: 115200 })

      // Try to identify device type
      const deviceInfo = await this.identifyDevice(port)
      if (deviceInfo) {
        this.connectedDevices.set(deviceInfo.id, deviceInfo)
        this.onDeviceConnected?.(deviceInfo)
      }
    } catch (error) {
      console.error("Failed to detect device:", error)
    }
  }

  private async identifyDevice(port: SerialPort): Promise<RealDevice | null> {
    try {
      // Send ADB command to identify device
      const command = "adb devices -l\n"
      const writer = port.writable?.getWriter()
      const reader = port.readable?.getReader()

      if (!writer || !reader) return null

      // Send command
      await writer.write(new TextEncoder().encode(command))
      writer.releaseLock()

      // Read response
      const { value } = await reader.read()
      const response = new TextDecoder().decode(value)
      reader.releaseLock()

      return this.parseDeviceInfo(response, port)
    } catch (error) {
      console.error("Failed to identify device:", error)
      return null
    }
  }

  private parseDeviceInfo(response: string, port: SerialPort): RealDevice | null {
    // Parse ADB response to extract device information
    const lines = response.split("\n")

    for (const line of lines) {
      if (line.includes("device") && !line.includes("List of devices")) {
        const parts = line.split("\t")
        if (parts.length >= 2) {
          const serialNumber = parts[0]

          // Create device object with real data
          return {
            id: serialNumber,
            name: "Unknown Device", // Will be updated with real info
            model: "Unknown",
            os: "Android",
            version: "Unknown",
            buildNumber: "Unknown",
            serialNumber,
            imei: "Unknown",
            batteryLevel: 0,
            batteryHealth: 0,
            storageUsed: 0,
            storageTotal: 0,
            ramUsed: 0,
            ramTotal: 0,
            cpuUsage: 0,
            temperature: 0,
            bootloaderLocked: true,
            rootStatus: false,
            securityPatch: "Unknown",
            brand: "Unknown",
            chipset: "Unknown",
            screenResolution: "Unknown",
            port,
            connectionType: "adb",
          }
        }
      }
    }

    return null
  }

  private async startADBDetection() {
    // Simulate ADB detection process
    setInterval(async () => {
      try {
        // In a real implementation, this would execute actual ADB commands
        await this.checkADBDevices()
      } catch (error) {
        console.error("ADB detection error:", error)
      }
    }, 5000) // Check every 5 seconds
  }

  private async checkADBDevices() {
    // This would normally execute: adb devices -l
    // For now, we'll simulate the process
    console.log("Checking for ADB devices...")
  }

  public async requestUSBDevice(): Promise<RealDevice | null> {
    try {
      if ("serial" in navigator) {
        const port = await navigator.serial.requestPort({
          filters: [
            { usbVendorId: 0x18d1 }, // Google (Android)
            { usbVendorId: 0x04e8 }, // Samsung
            { usbVendorId: 0x2717 }, // Xiaomi
            { usbVendorId: 0x05ac }, // Apple
          ],
        })

        return (await this.detectDevice(port)) ? this.connectedDevices.get(port.toString()) || null : null
      }
    } catch (error) {
      console.error("Failed to request USB device:", error)
    }

    return null
  }

  public async getDeviceInfo(deviceId: string): Promise<Partial<RealDevice> | null> {
    const device = this.connectedDevices.get(deviceId)
    if (!device || !device.port) return null

    try {
      // Get detailed device information
      const info = await this.executeADBCommand(device.port, "shell getprop")
      return this.parseDetailedInfo(info)
    } catch (error) {
      console.error("Failed to get device info:", error)
      return null
    }
  }

  private async executeADBCommand(port: SerialPort, command: string): Promise<string> {
    const writer = port.writable?.getWriter()
    const reader = port.readable?.getReader()

    if (!writer || !reader) throw new Error("Port not available")

    try {
      // Send ADB command
      await writer.write(new TextEncoder().encode(`adb ${command}\n`))
      writer.releaseLock()

      // Read response
      const { value } = await reader.read()
      const response = new TextDecoder().decode(value)
      reader.releaseLock()

      return response
    } catch (error) {
      writer?.releaseLock()
      reader?.releaseLock()
      throw error
    }
  }

  private parseDetailedInfo(propOutput: string): Partial<RealDevice> {
    const props: Record<string, string> = {}
    const lines = propOutput.split("\n")

    for (const line of lines) {
      const match = line.match(/\[(.+?)\]: \[(.+?)\]/)
      if (match) {
        props[match[1]] = match[2]
      }
    }

    return {
      name: props["ro.product.model"] || "Unknown",
      model: props["ro.product.device"] || "Unknown",
      version: props["ro.build.version.release"] || "Unknown",
      buildNumber: props["ro.build.display.id"] || "Unknown",
      brand: props["ro.product.brand"] || "Unknown",
      chipset: props["ro.board.platform"] || "Unknown",
      securityPatch: props["ro.build.version.security_patch"] || "Unknown",
    }
  }

  public setOnDeviceConnected(callback: (device: RealDevice) => void) {
    this.onDeviceConnected = callback
  }

  public setOnDeviceDisconnected(callback: (deviceId: string) => void) {
    this.onDeviceDisconnected = callback
  }

  public getConnectedDevices(): RealDevice[] {
    return Array.from(this.connectedDevices.values())
  }

  public async executeOperation(deviceId: string, operation: string, params?: any): Promise<boolean> {
    const device = this.connectedDevices.get(deviceId)
    if (!device || !device.port) return false

    try {
      switch (operation) {
        case "reboot":
          await this.executeADBCommand(device.port, "reboot")
          break
        case "reboot-bootloader":
          await this.executeADBCommand(device.port, "reboot bootloader")
          break
        case "get-battery":
          const batteryInfo = await this.executeADBCommand(device.port, "shell dumpsys battery")
          // Parse battery info and update device
          break
        case "install-apk":
          if (params?.apkPath) {
            await this.executeADBCommand(device.port, `install "${params.apkPath}"`)
          }
          break
        case "backup":
          await this.executeADBCommand(device.port, `backup -all -f "${params?.backupPath || "backup.ab"}"`)
          break
        case "restore":
          if (params?.backupPath) {
            await this.executeADBCommand(device.port, `restore "${params.backupPath}"`)
          }
          break
        default:
          console.warn("Unknown operation:", operation)
          return false
      }

      return true
    } catch (error) {
      console.error("Operation failed:", error)
      return false
    }
  }
}
