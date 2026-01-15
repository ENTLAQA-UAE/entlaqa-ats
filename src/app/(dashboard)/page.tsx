import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, Users, Briefcase, TrendingUp, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

async function getStats() {
  const supabase = await createClient()

  // Get organizations count by status
  const { count: orgsCount } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true })

  const { count: activeOrgsCount } = await supabase
    .from("organizations")
    .select("*", { count: "exact", head: true })
    .eq("status", "active")

  // Get subscription tiers
  const { data: tiers } = await supabase
    .from("subscription_tiers")
    .select("*")
    .eq("is_active", true)

  // Get user profiles count
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })

  // Get recent organizations
  const { data: recentOrgs } = await supabase
    .from("organizations")
    .select(`
      id,
      name,
      status,
      created_at,
      subscription_tiers (name)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  return {
    organizations: orgsCount || 0,
    activeOrganizations: activeOrgsCount || 0,
    tiers: tiers?.length || 0,
    activeUsers: usersCount || 0,
    recentOrganizations: recentOrgs || [],
    monthlyRevenue: 0,
  }
}

export default async function DashboardPage() {
  const stats = await getStats()

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Welcome to Jadarat ATS</h2>
        <p className="text-muted-foreground">
          AI-Powered Applicant Tracking System for MENA Region
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Organizations</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.organizations}</div>
            <p className="text-xs text-muted-foreground">Active tenants on platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeUsers}</div>
            <p className="text-xs text-muted-foreground">Across all organizations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription Tiers</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.tiers}</div>
            <p className="text-xs text-muted-foreground">Active pricing plans</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current MRR</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Get started by adding organizations, configuring subscription tiers, or viewing analytics.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="default" className="bg-green-500">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API</span>
              <Badge variant="default" className="bg-green-500">Operational</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">AI Services</span>
              <Badge variant="default" className="bg-green-500">Active</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Organizations Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Organizations</CardTitle>
          <Link href="/organizations" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </CardHeader>
        <CardContent>
          {stats.recentOrganizations.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Tier</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrganizations.map((org: any) => (
                  <TableRow key={org.id}>
                    <TableCell className="font-medium">{org.name}</TableCell>
                    <TableCell>{org.subscription_tiers?.name || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={org.status === "active" ? "default" : "secondary"}>
                        {org.status === "active" ? (
                          <CheckCircle className="h-3 w-3 mr-1" />
                        ) : (
                          <Clock className="h-3 w-3 mr-1" />
                        )}
                        {org.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(org.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No organizations yet. Create your first organization to get started.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
