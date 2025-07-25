"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Smartphone,
  Tablet,
  Wifi,
  Battery,
  Shield,
  Unlock,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
} from "lucide-react"

interface Device {
  id: string
  name: string
  model: string
  os: string
  version: string
  status: "connected" | "disconnected" | "processing"
  batteryLevel: number
  icon: typeof Smartphone | typeof Tablet
}

interface Operation {
  id: string
  name: string
  description: string
  status: "idle" | "running" | "completed" | "error"
  progress: number
}

const supportedDevices: Device[] = [
  {
    id: "1",
    name: "iPhone 15 Pro",
    model: "A3102",
    os: "iOS",
    version: "17.2.1",
    status: "connected",
    batteryLevel: 85,
    icon: Smartphone,
  },
  {
    id: "2",
    name: "Samsung Galaxy S24",
    model: "SM-S921B",
    os: "Android",
    version: "14",
    status: "disconnected",
    batteryLevel: 0,
    icon: Smartphone,
  },
  {
    id: "3",
    name: "iPad Pro",
    model: "A2759",
    os: "iPadOS",
    version: "17.2",
    status: "connected",
    batteryLevel: 92,
    icon: Tablet,
  },
]

const repairOperations = [
  {
    id: "bypass-lock",
    name: "Bypass Lock Screen",
    description: "Remove screen lock without data loss",
    category: "Security",
  },
  {
    id: "icloud-removal",
    name: "iCloud Account Removal",
    description: "Remove iCloud activation lock",
    category: "Security",
  },
  {
    id: "frp-bypass",
    name: "FRP Bypass",
    description: "Bypass Factory Reset Protection",
    category: "Security",
  },
  {
    id: "bootloader-unlock",
    name: "Bootloader Unlock",
    description: "Unlock device bootloader",
    category: "System",
  },
  {
    id: "root-jailbreak",
    name: "Root/Jailbreak",
    description: "Gain root access to device",
    category: "System",
  },
  {
    id: "firmware-flash",
    name: "Firmware Flash",
    description: "Flash custom or stock firmware",
    category: "System",
  },
  {
    id: "data-recovery",
    name: "Data Recovery",
    description: "Recover deleted files and data",
    category: "Data",
  },
  {
    id: "backup-restore",
    name: "Backup & Restore",
    description: "Create and restore device backups",
    category: "Data",
  },
]

export function DeviceManager() {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(supportedDevices[0])
  const [operations, setOperations] = useState<Operation[]>([])
  const [logs, setLogs] = useState<string[]>([
    "[INFO] Wuxinji Pro v3.2.1 initialized",
    "[INFO] USB debugging enabled",
    "[INFO] Device drivers loaded successfully",
  ])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [...prev, `[${timestamp}] ${message}`])
  }

  const startOperation = (operationId: string) => {
    const operation = repairOperations.find((op) => op.id === operationId)
    if (!operation || !selectedDevice) return

    const newOperation: Operation = {
      id: operationId,
      name: operation.name,
      description: operation.description,
      status: "running",
      progress: 0,
    }

    setOperations((prev) => [...prev, newOperation])
    addLog(`Starting ${operation.name} on ${selectedDevice.name}`)

    // Simulate operation progress
    const interval = setInterval(() => {
      setOperations((prev) =>
        prev.map((op) => {
          if (op.id === operationId && op.status === "running") {
            const newProgress = Math.min(op.progress + Math.random() * 20, 100)
            if (newProgress >= 100) {
              addLog(`${operation.name} completed successfully`)
              return { ...op, progress: 100, status: "completed" }
            }
            return { ...op, progress: newProgress }
          }
          return op
        }),
      )
    }, 500)

    setTimeout(() => {
      clearInterval(interval)
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected":
        return "bg-green-500"
      case "processing":
        return "bg-yellow-500"
      case "disconnected":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getOperationStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Play className="h-4 w-4" />
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Wuxinji Pro</h1>
        <p className="text-gray-300">Professional Mobile Device Repair Tool</p>
        <Badge variant="secondary" className="bg-purple-600 text-white">
          v3.2.1 Professional Edition
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Connected Devices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {supportedDevices.map((device) => {
              const IconComponent = device.icon
              return (
                <div
                  key={device.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedDevice?.id === device.id
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-slate-600 hover:border-slate-500"
                  }`}
                  onClick={() => setSelectedDevice(device)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <IconComponent className="h-6 w-6 text-gray-300" />
                      <div>
                        <p className="text-white font-medium">{device.name}</p>
                        <p className="text-gray-400 text-sm">{device.model}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                      {device.status === "connected" && (
                        <Badge variant="outline" className="text-xs">
                          {device.batteryLevel}%
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    {device.os} {device.version}
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Main Operations */}
        <Card className="lg:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Device Operations</CardTitle>
            <CardDescription className="text-gray-400">
              {selectedDevice ? `Working with ${selectedDevice.name}` : "Select a device to continue"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDevice ? (
              <Tabs defaultValue="repair" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-slate-700">
                  <TabsTrigger value="repair" className="text-white">
                    Repair
                  </TabsTrigger>
                  <TabsTrigger value="info" className="text-white">
                    Device Info
                  </TabsTrigger>
                  <TabsTrigger value="backup" className="text-white">
                    Backup
                  </TabsTrigger>
                  <TabsTrigger value="advanced" className="text-white">
                    Advanced
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="repair" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {repairOperations.map((operation) => (
                      <Card key={operation.id} className="bg-slate-700 border-slate-600">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-sm">{operation.name}</CardTitle>
                            <Badge variant="outline" className="text-xs">
                              {operation.category}
                            </Badge>
                          </div>
                          <CardDescription className="text-gray-400 text-xs">{operation.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <Button
                            onClick={() => startOperation(operation.id)}
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            size="sm"
                            disabled={selectedDevice.status !== "connected"}
                          >
                            Start Operation
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-white">Device Name</Label>
                      <Input
                        value={selectedDevice.name}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Model</Label>
                      <Input
                        value={selectedDevice.model}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">OS Version</Label>
                      <Input
                        value={`${selectedDevice.os} ${selectedDevice.version}`}
                        readOnly
                        className="bg-slate-700 border-slate-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-white">Battery Level</Label>
                      <div className="flex items-center gap-2">
                        <Progress value={selectedDevice.batteryLevel} className="flex-1" />
                        <span className="text-white text-sm">{selectedDevice.batteryLevel}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                      <Info className="h-4 w-4 mr-2" />
                      System Info
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                      <Battery className="h-4 w-4 mr-2" />
                      Battery Test
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
                      <Wifi className="h-4 w-4 mr-2" />
                      Network Test
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="backup" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Upload className="h-4 w-4" />
                          Create Backup
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white text-xs">Backup Type</Label>
                          <select className="w-full p-2 bg-slate-600 border border-slate-500 rounded text-white text-sm">
                            <option>Full System Backup</option>
                            <option>User Data Only</option>
                            <option>Apps & Settings</option>
                          </select>
                        </div>
                        <Button className="w-full bg-green-600 hover:bg-green-700" size="sm">
                          Start Backup
                        </Button>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-700 border-slate-600">
                      <CardHeader>
                        <CardTitle className="text-white text-sm flex items-center gap-2">
                          <Download className="h-4 w-4" />
                          Restore Backup
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="space-y-2">
                          <Label className="text-white text-xs">Select Backup File</Label>
                          <Input type="file" className="bg-slate-600 border-slate-500 text-white text-sm" />
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" size="sm">
                          Restore Backup
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="advanced" className="space-y-4">
                  <Alert className="bg-yellow-900 border-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-200">
                      Advanced operations may void warranty and can brick your device. Proceed with caution.
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="border-red-600 text-red-400 hover:bg-red-900 bg-transparent">
                      <Shield className="h-4 w-4 mr-2" />
                      Flash Firmware
                    </Button>
                    <Button
                      variant="outline"
                      className="border-orange-600 text-orange-400 hover:bg-orange-900 bg-transparent"
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Unlock Bootloader
                    </Button>
                    <Button
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-900 bg-transparent"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Custom Recovery
                    </Button>
                    <Button
                      variant="outline"
                      className="border-blue-600 text-blue-400 hover:bg-blue-900 bg-transparent"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Factory Reset
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            ) : (
              <div className="text-center py-12">
                <Smartphone className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">Select a device to start operations</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operations Status & Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Operations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Active Operations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {operations.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No active operations</p>
            ) : (
              operations.map((operation) => (
                <div key={operation.id} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getOperationStatusIcon(operation.status)}
                      <span className="text-white text-sm font-medium">{operation.name}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {operation.status}
                    </Badge>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{operation.description}</p>
                  <Progress value={operation.progress} className="h-2" />
                  <p className="text-gray-400 text-xs mt-1">{Math.round(operation.progress)}% complete</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* System Logs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-black rounded-lg p-4 h-64 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="text-green-400 mb-1">
                  {log}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
