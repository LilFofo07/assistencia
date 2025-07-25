"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DeviceDetector, type RealDevice } from "@/lib/device-detector"
import { Smartphone, Usb, RefreshCw, AlertTriangle, Zap, Shield, Battery, HardDrive, Wifi } from "lucide-react"

export function RealDeviceManager() {
  const [detector] = useState(() => new DeviceDetector())
  const [connectedDevices, setConnectedDevices] = useState<RealDevice[]>([])
  const [selectedDevice, setSelectedDevice] = useState<RealDevice | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [operationStatus, setOperationStatus] = useState<string>("")
  const [logs, setLogs] = useState<string[]>([
    "[SYSTEM] Wuxinji Real Device Manager initialized",
    "[USB] Checking for USB debugging support...",
    "[ADB] Starting ADB daemon...",
  ])

  useEffect(() => {
    // Set up device detection callbacks
    detector.setOnDeviceConnected((device) => {
      setConnectedDevices((prev) => [...prev, device])
      addLog(`Device connected: ${device.name || device.serialNumber}`, "SUCCESS")
    })

    detector.setOnDeviceDisconnected((deviceId) => {
      setConnectedDevices((prev) => prev.filter((d) => d.id !== deviceId))
      addLog(`Device disconnected: ${deviceId}`, "WARNING")

      if (selectedDevice?.id === deviceId) {
        setSelectedDevice(null)
      }
    })

    // Get initially connected devices
    setConnectedDevices(detector.getConnectedDevices())
  }, [detector, selectedDevice])

  const addLog = (message: string, type: "INFO" | "WARNING" | "ERROR" | "SUCCESS" = "INFO") => {
    const timestamp = new Date().toLocaleTimeString()
    const logEntry = `[${timestamp}] [${type}] ${message}`
    setLogs((prev) => [...prev.slice(-50), logEntry]) // Keep only last 50 logs
  }

  const handleConnectUSB = async () => {
    setIsScanning(true)
    addLog("Requesting USB device access...", "INFO")

    try {
      const device = await detector.requestUSBDevice()
      if (device) {
        addLog(`USB device connected: ${device.serialNumber}`, "SUCCESS")

        // Get detailed device information
        const detailedInfo = await detector.getDeviceInfo(device.id)
        if (detailedInfo) {
          // Update device with real information
          const updatedDevice = { ...device, ...detailedInfo }
          setConnectedDevices((prev) => prev.map((d) => (d.id === device.id ? updatedDevice : d)))
          addLog(`Device info updated: ${detailedInfo.name}`, "SUCCESS")
        }
      } else {
        addLog("No device selected or connection failed", "WARNING")
      }
    } catch (error) {
      addLog(`USB connection failed: ${error}`, "ERROR")
    } finally {
      setIsScanning(false)
    }
  }

  const handleRefreshDevices = async () => {
    setIsScanning(true)
    addLog("Scanning for connected devices...", "INFO")

    try {
      // Refresh device list
      const devices = detector.getConnectedDevices()
      setConnectedDevices(devices)
      addLog(`Found ${devices.length} connected devices`, "INFO")
    } catch (error) {
      addLog(`Device scan failed: ${error}`, "ERROR")
    } finally {
      setIsScanning(false)
    }
  }

  const executeOperation = async (operation: string, params?: any) => {
    if (!selectedDevice) return

    setOperationStatus(`Executing ${operation}...`)
    addLog(`Starting operation: ${operation} on ${selectedDevice.name}`, "INFO")

    try {
      const success = await detector.executeOperation(selectedDevice.id, operation, params)
      if (success) {
        addLog(`Operation ${operation} completed successfully`, "SUCCESS")
        setOperationStatus(`${operation} completed`)
      } else {
        addLog(`Operation ${operation} failed`, "ERROR")
        setOperationStatus(`${operation} failed`)
      }
    } catch (error) {
      addLog(`Operation ${operation} error: ${error}`, "ERROR")
      setOperationStatus(`${operation} error`)
    }

    setTimeout(() => setOperationStatus(""), 3000)
  }

  const getConnectionStatusColor = (device: RealDevice) => {
    switch (device.connectionType) {
      case "adb":
        return "bg-green-500"
      case "fastboot":
        return "bg-yellow-500"
      case "usb":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Wuxinji Real Device Manager</h1>
        <p className="text-gray-300">Connect and manage real devices via USB/ADB</p>
        <div className="flex items-center justify-center gap-4">
          <Badge variant="secondary" className="bg-green-600 text-white">
            Real Device Support
          </Badge>
          <Badge variant="outline" className="border-blue-400 text-blue-400">
            USB/ADB Ready
          </Badge>
        </div>
      </div>

      {/* Connection Controls */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Usb className="h-5 w-5" />
            Device Connection
          </CardTitle>
          <CardDescription className="text-gray-400">
            Connect your device via USB with debugging enabled
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-blue-900 border-blue-600">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-blue-200">
              <strong>Before connecting:</strong>
              <br />• Enable USB Debugging in Developer Options
              <br />• Install ADB drivers on your computer
              <br />• Allow USB debugging when prompted on device
            </AlertDescription>
          </Alert>

          <div className="flex items-center gap-4">
            <Button onClick={handleConnectUSB} disabled={isScanning} className="bg-blue-600 hover:bg-blue-700">
              {isScanning ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Usb className="h-4 w-4 mr-2" />
                  Connect USB Device
                </>
              )}
            </Button>

            <Button
              onClick={handleRefreshDevices}
              variant="outline"
              disabled={isScanning}
              className="border-slate-600 text-white hover:bg-slate-700 bg-transparent"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Devices
            </Button>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${connectedDevices.length > 0 ? "bg-green-500" : "bg-red-500"}`} />
              <span className="text-white text-sm">{connectedDevices.length} device(s) connected</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Connected Devices */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Connected Devices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {connectedDevices.length === 0 ? (
              <div className="text-center py-8">
                <Smartphone className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No devices connected</p>
                <p className="text-gray-500 text-sm">Connect a device via USB</p>
              </div>
            ) : (
              connectedDevices.map((device) => (
                <div
                  key={device.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedDevice?.id === device.id
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Smartphone className="h-6 w-6 text-gray-300" />
                      <div>
                        <p className="text-white font-medium">{device.name}</p>
                        <p className="text-gray-400 text-sm">{device.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getConnectionStatusColor(device)}`} />
                      <Badge variant="outline" className="text-xs">
                        {device.connectionType.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 space-y-1">
                    <div>
                      {device.os} {device.version}
                    </div>
                    <div>Serial: {device.serialNumber}</div>
                    <div>Brand: {device.brand}</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Device Operations */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Real Device Operations</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedDevice
                ? `Operating on ${selectedDevice.name}`
                : "Select a connected device to perform operations"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDevice ? (
              <div className="space-y-6">
                {/* Device Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">Device Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Name:</span>
                        <span className="text-white">{selectedDevice.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Model:</span>
                        <span className="text-white">{selectedDevice.model}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">OS:</span>
                        <span className="text-white">
                          {selectedDevice.os} {selectedDevice.version}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Serial:</span>
                        <span className="text-white font-mono text-xs">{selectedDevice.serialNumber}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm">Connection Status</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {selectedDevice.connectionType.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Root:</span>
                        <Badge variant={selectedDevice.rootStatus ? "default" : "secondary"} className="text-xs">
                          {selectedDevice.rootStatus ? "Yes" : "No"}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bootloader:</span>
                        <Badge
                          variant={selectedDevice.bootloaderLocked ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {selectedDevice.bootloaderLocked ? "Locked" : "Unlocked"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Operation Status */}
                {operationStatus && (
                  <Alert className="bg-blue-900 border-blue-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <AlertDescription className="text-blue-200">{operationStatus}</AlertDescription>
                  </Alert>
                )}

                {/* Real Operations */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => executeOperation("get-battery")}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={!!operationStatus}
                  >
                    <Battery className="h-4 w-4 mr-2" />
                    Get Battery Info
                  </Button>

                  <Button
                    onClick={() => executeOperation("reboot")}
                    className="bg-yellow-600 hover:bg-yellow-700"
                    disabled={!!operationStatus}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reboot Device
                  </Button>

                  <Button
                    onClick={() => executeOperation("reboot-bootloader")}
                    className="bg-orange-600 hover:bg-orange-700"
                    disabled={!!operationStatus}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Reboot Bootloader
                  </Button>

                  <Button
                    onClick={() => executeOperation("backup")}
                    className="bg-blue-600 hover:bg-blue-700"
                    disabled={!!operationStatus}
                  >
                    <HardDrive className="h-4 w-4 mr-2" />
                    Create Backup
                  </Button>

                  <Button
                    onClick={() => executeOperation("install-apk")}
                    className="bg-purple-600 hover:bg-purple-700"
                    disabled={!!operationStatus}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Install APK
                  </Button>

                  <Button
                    onClick={() => executeOperation("network-test")}
                    className="bg-cyan-600 hover:bg-cyan-700"
                    disabled={!!operationStatus}
                  >
                    <Wifi className="h-4 w-4 mr-2" />
                    Network Test
                  </Button>
                </div>

                {/* Warning */}
                <Alert className="bg-red-900 border-red-600">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-red-200">
                    <strong>Warning:</strong> These operations interact with real devices. Ensure you have proper
                    backups and understand the risks before proceeding.
                  </AlertDescription>
                </Alert>
              </div>
            ) : (
              <div className="text-center py-12">
                <Usb className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Connect a device to start operations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* System Logs */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Real-time Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.map((log, index) => {
              const logType = log.includes("[ERROR]")
                ? "text-red-400"
                : log.includes("[WARNING]")
                  ? "text-yellow-400"
                  : log.includes("[SUCCESS]")
                    ? "text-green-400"
                    : "text-blue-400"
              return (
                <div key={index} className={`${logType} mb-1`}>
                  {log}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
