import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Camera, Edit, Mail, MapPin, Calendar, Briefcase } from "lucide-react";

interface User {
  name: string;
  email: string;
  role: string;
  location: string;
  joinDate: string;
  avatar: string;
  status: "Active" | "Inactive";
  department: string;
}

export function ProfileHeader(){
  const [user] = useState<User>({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Senior Developer",
    location: "Jakarta, Indonesia",
    joinDate: "January 2023",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    status: "Active",
    department: "Engineering"
  });

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6 md:flex-row md:space-y-0 md:space-x-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                variant="secondary"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
              {user.status}
            </Badge>
          </div>

          {/* User Info Section */}
          <div className="flex-1 space-y-4">
            <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {user.role}
                </p>
              </div>
              <Button className="self-start md:self-auto">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            </div>

            {/* Contact & Info Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4" />
                <span className="text-sm">{user.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Joined {user.joinDate}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">{user.department}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}