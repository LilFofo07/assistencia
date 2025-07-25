"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Smartphone, Settings, Shield, Terminal, CheckCircle, AlertTriangle } from "lucide-react"

export function SetupGuide() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Setup Guide</h1>
        <p className="text-gray-300">Configure your system for real device connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Android Setup */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="h-5 w-5" />
              Android Device Setup
            </CardTitle>
            <CardDescription className="text-gray-400">Prepare your Android device for connection</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Enable Developer Options</p>
                  <p className="text-gray-400 text-sm">Go to Settings → About Phone → Tap "Build Number" 7 times</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Enable USB Debugging</p>
                  <p className="text-gray-400 text-sm">Settings → Developer Options → USB Debugging (ON)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Allow USB Debugging</p>
                  <p className="text-gray-400 text-sm">When prompted on device, tap "Allow" and check "Always allow"</p>
                </div>
              </div>
            </div>

            <Alert className="bg-yellow-900 border-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-200">
                Some devices may require OEM Unlocking to be enabled for advanced operations.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Computer Setup */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              Computer Setup
            </CardTitle>
            <CardDescription className="text-gray-400">Install required drivers and tools</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Install ADB Drivers</p>
                  <p className="text-gray-400 text-sm">Download and install Android SDK Platform Tools</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">Enable Chrome Flags</p>
                  <p className="text-gray-400 text-sm">chrome://flags → Enable "Experimental Web Platform features"</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Use HTTPS</p>
                  <p className="text-gray-400 text-sm">Web Serial API requires secure context (HTTPS/localhost)</p>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-900 border-blue-600">
              <Shield className="h-4 w-4" />
              <AlertDescription className="text-blue-200">
                For best compatibility, use Chrome/Edge browser with latest version.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Supported Operations */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Supported Operations
            </CardTitle>
            <CardDescription className="text-gray-400">What you can do with connected devices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 gap-2">
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ Device Information Reading
              </Badge>
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ Battery Status & Health
              </Badge>
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ System Properties
              </Badge>
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ App Installation/Removal
              </Badge>
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ File Transfer
              </Badge>
              <Badge variant="outline" className="justify-start text-green-400 border-green-400">
                ✓ Backup & Restore
              </Badge>
              <Badge variant="outline" className="justify-start text-yellow-400 border-yellow-400">
                ⚠ Bootloader Operations
              </Badge>
              <Badge variant="outline" className="justify-start text-red-400 border-red-400">
                ⚠ Root/Jailbreak (Advanced)
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Troubleshooting
            </CardTitle>
            <CardDescription className="text-gray-400">Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div>
                <p className="text-white font-medium text-sm">Device not detected?</p>
                <p className="text-gray-400 text-xs">• Check USB cable and try different port</p>
                <p className="text-gray-400 text-xs">• Ensure USB Debugging is enabled</p>
                <p className="text-gray-400 text-xs">• Try revoking and re-authorizing USB debugging</p>
              </div>

              <div>
                <p className="text-white font-medium text-sm">Permission denied?</p>
                <p className="text-gray-400 text-xs">• Run browser as administrator</p>
                <p className="text-gray-400 text-xs">• Check device authorization dialog</p>
              </div>

              <div>
                <p className="text-white font-medium text-sm">Operations failing?</p>
                <p className="text-gray-400 text-xs">• Ensure device is unlocked</p>
                <p className="text-gray-400 text-xs">• Check if device requires additional permissions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
