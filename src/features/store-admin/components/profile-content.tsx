import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { User, Building2, Calendar, Edit, Save, X } from "lucide-react";
import { apiUser } from "@/api/api-user";
import { apiAuth } from "@/api/api-auth";
import { tokenManager } from "@/lib/axios";

export function ProfileContent() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to get user data from cache first
      const cachedUserData = apiAuth.getCurrentUserData();
      if (cachedUserData) {
        setUser(cachedUserData);
        setEditForm({
          name: cachedUserData.name,
          email: cachedUserData.email,
          phone: cachedUserData.phone,
        });
      }

      // Then fetch fresh data from API
      const response = await apiUser.getCurrentUser();
      const userData = response.data.user;

      setUser(userData);
      setEditForm({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      });

      // Update cached data via tokenManager
      tokenManager.saveUserData({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        merchants: userData.merchants || [],
      });
    } catch (err: any) {
      setError(err.message || "Failed to fetch user data");
      console.error("Failed to fetch user data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setError(null);
    if (user) {
      setEditForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
      });
    }
  };

  const handleSave = async () => {
    // try {
    //   setSaving(true);
    //   setError(null);

    //   // Validate form data
    //   if (!editForm.name.trim()) {
    //     throw new Error("Name is required");
    //   }
    //   if (!editForm.email.trim()) {
    //     throw new Error("Email is required");
    //   }
    //   if (!editForm.phone.trim()) {
    //     throw new Error("Phone is required");
    //   }

    //   // Call API to update user
    //   const response = await apiUser.updateCurrentUser({
    //     name: editForm.name.trim(),
    //     email: editForm.email.trim(),
    //     phone: editForm.phone.trim(),
    //   });

    //   // Update local state and cache
    //   const updatedUser = response.data.user;
    //   setUser(updatedUser);

    //   // Update cached data via tokenManager
    //   tokenManager.saveUserData({
    //     id: updatedUser.id,
    //     name: updatedUser.name,
    //     email: updatedUser.email,
    //     phone: updatedUser.phone,
    //     role: updatedUser.role,
    //     created_at: updatedUser.created_at,
    //     updated_at: updatedUser.updated_at,
    //     merchants: updatedUser.merchants || [],
    //   });

    //   setEditing(false);
    // } catch (err: any) {
    //   setError(err.message || "Failed to update profile");
    //   console.error("Failed to update user:", err);
    // } finally {
    //   setSaving(false);
    // }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString; // Fallback to original string if parsing fails
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center space-y-2">
            <p className="text-gray-500">No user data available</p>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button onClick={fetchUserData} variant="outline" size="sm">
              Retry
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Tabs defaultValue="personal" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personal" className="flex items-center gap-2">
          <User className="w-4 h-4" />
          Personal Info
        </TabsTrigger>
        <TabsTrigger value="merchants" className="flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Merchants
        </TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                <CardDescription>Manage your personal account information</CardDescription>
              </div>
              <div className="flex gap-2">
                {editing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      size="sm"
                      className="flex items-center gap-1"
                      disabled={saving}
                    >
                      <Save className="w-4 h-4" />
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                      disabled={saving}
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEdit}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {editing ? (
                  <Input
                    id="name"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    disabled={saving}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.name}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {editing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    disabled={saving}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.email}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                {editing ? (
                  <Input
                    id="phone"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    disabled={saving}
                  />
                ) : (
                  <div className="p-2 bg-gray-50 rounded-md">{user.phone}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label>Role</Label>
                <div className="p-2 bg-gray-50 rounded-md">
                  <Badge
                    variant={user.role === "admin" ? "destructive" : "default"}
                    className="capitalize"
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>User ID</Label>
                <div className="p-2 bg-gray-50 rounded-md font-mono text-sm">{user.id}</div>
              </div>

              <div className="space-y-2">
                <Label>Account Created</Label>
                <div className="p-2 bg-gray-50 rounded-md text-sm">
                  {formatDate(user.created_at)}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Last Updated</Label>
              <div className="p-2 bg-gray-50 rounded-md text-sm">{formatDate(user.updated_at)}</div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="merchants" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Associated Merchants
            </CardTitle>
            <CardDescription>Manage your merchant accounts and businesses</CardDescription>
          </CardHeader>
          <CardContent>
            {user.merchants && user.merchants.length > 0 ? (
              <div className="space-y-4">
                {user.merchants.map((merchant) => (
                  <Card key={merchant.id} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{merchant.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 text-sm">
                            <span className="font-mono">ID: {merchant.id}</span>
                            <span>Owner ID: {merchant.owner_id}</span>
                          </CardDescription>
                        </div>
                        <Badge variant="outline">Active</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Created: {formatDate(merchant.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>Updated: {formatDate(merchant.updated_at)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Merchants Found</h3>
                <p className="text-gray-500">
                  You don't have any associated merchant accounts yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
