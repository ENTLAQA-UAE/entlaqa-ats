"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Settings,
  Globe,
  Shield,
  Bell,
  Palette,
  Database,
  Mail,
  Key,
  Languages,
  Save,
  RefreshCw,
} from "lucide-react"
import { toast } from "sonner"

export function SettingsClient() {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General
    appName: "Jadarat ATS",
    appNameAr: "جدارات",
    supportEmail: "support@jadarat.io",
    defaultLanguage: "en",
    timezone: "Asia/Riyadh",

    // Security
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    enforceStrongPassword: true,
    require2FA: false,

    // Notifications
    emailNotifications: true,
    slackIntegration: false,
    webhookUrl: "",

    // AI Settings
    aiProvider: "openai",
    enableAutoScoring: true,
    enableResumeParser: true,
  })

  const handleSave = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsLoading(false)
    toast.success("Settings saved successfully")
  }

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Platform Settings</h2>
          <p className="text-muted-foreground">
            Configure global settings for the Jadarat ATS platform
          </p>
        </div>
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? (
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>Basic platform configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="appName">App Name (English)</Label>
                <Input
                  id="appName"
                  value={settings.appName}
                  onChange={(e) => updateSetting("appName", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="appNameAr">App Name (Arabic)</Label>
                <Input
                  id="appNameAr"
                  value={settings.appNameAr}
                  onChange={(e) => updateSetting("appNameAr", e.target.value)}
                  dir="rtl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supportEmail">Support Email</Label>
              <Input
                id="supportEmail"
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select
                  value={settings.defaultLanguage}
                  onValueChange={(value) => updateSetting("defaultLanguage", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ar">Arabic (العربية)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => updateSetting("timezone", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asia/Riyadh">Riyadh (GMT+3)</SelectItem>
                    <SelectItem value="Asia/Dubai">Dubai (GMT+4)</SelectItem>
                    <SelectItem value="Africa/Cairo">Cairo (GMT+2)</SelectItem>
                    <SelectItem value="UTC">UTC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Authentication and security options</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    updateSetting("sessionTimeout", parseInt(e.target.value) || 30)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) =>
                    updateSetting("maxLoginAttempts", parseInt(e.target.value) || 5)
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <ToggleOption
                label="Enforce Strong Passwords"
                description="Require complex passwords for all users"
                enabled={settings.enforceStrongPassword}
                onChange={(enabled) => updateSetting("enforceStrongPassword", enabled)}
              />
              <ToggleOption
                label="Require Two-Factor Authentication"
                description="Enforce 2FA for all admin accounts"
                enabled={settings.require2FA}
                onChange={(enabled) => updateSetting("require2FA", enabled)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Localization Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Languages className="h-5 w-5" />
              <CardTitle>Localization</CardTitle>
            </div>
            <CardDescription>Language and regional settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">English (EN)</p>
                  <p className="text-sm text-muted-foreground">Left-to-right layout</p>
                </div>
                <Badge variant="default">Default</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">Arabic (العربية)</p>
                  <p className="text-sm text-muted-foreground">Right-to-left layout</p>
                </div>
                <Badge variant="secondary">Enabled</Badge>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Regional Format</p>
              <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div>Date: DD/MM/YYYY</div>
                <div>Currency: SAR</div>
                <div>Number: 1,234.56</div>
                <div>Week Start: Sunday</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AI Configuration */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              <CardTitle>AI Configuration</CardTitle>
            </div>
            <CardDescription>AI service settings and features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select
                value={settings.aiProvider}
                onValueChange={(value) => updateSetting("aiProvider", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI GPT-4</SelectItem>
                  <SelectItem value="anthropic">Anthropic Claude</SelectItem>
                  <SelectItem value="azure">Azure OpenAI</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="space-y-3">
              <ToggleOption
                label="AI Resume Parsing"
                description="Automatically extract data from uploaded resumes"
                enabled={settings.enableResumeParser}
                onChange={(enabled) => updateSetting("enableResumeParser", enabled)}
              />
              <ToggleOption
                label="AI Candidate Scoring"
                description="Automatically score candidates based on job requirements"
                enabled={settings.enableAutoScoring}
                onChange={(enabled) => updateSetting("enableAutoScoring", enabled)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Email and integration settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ToggleOption
              label="Email Notifications"
              description="Send system alerts via email"
              enabled={settings.emailNotifications}
              onChange={(enabled) => updateSetting("emailNotifications", enabled)}
            />
            <ToggleOption
              label="Slack Integration"
              description="Send notifications to Slack channels"
              enabled={settings.slackIntegration}
              onChange={(enabled) => updateSetting("slackIntegration", enabled)}
            />

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
              <Input
                id="webhookUrl"
                placeholder="https://your-webhook.com/notify"
                value={settings.webhookUrl}
                onChange={(e) => updateSetting("webhookUrl", e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Receive real-time notifications via webhook
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API & Integrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              <CardTitle>API & Integrations</CardTitle>
            </div>
            <CardDescription>External service connections</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Email Service</p>
                    <p className="text-sm text-muted-foreground">Resend</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Database</p>
                    <p className="text-sm text-muted-foreground">Supabase</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">CDN & Storage</p>
                    <p className="text-sm text-muted-foreground">Supabase Storage</p>
                  </div>
                </div>
                <Badge variant="default">Connected</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function ToggleOption({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string
  description: string
  enabled: boolean
  onChange: (enabled: boolean) => void
}) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
        enabled ? "bg-primary/10 border-primary" : "bg-muted/50"
      }`}
      onClick={() => onChange(!enabled)}
    >
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        className={`w-10 h-6 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-muted"
        } relative`}
      >
        <div
          className={`absolute w-4 h-4 rounded-full bg-white top-1 transition-transform ${
            enabled ? "translate-x-5" : "translate-x-1"
          }`}
        />
      </div>
    </div>
  )
}
