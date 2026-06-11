"use client";

import { Avatar, Skeleton } from "@heroui/react";
import { useUserProfile } from "@/lib/hooks/useUserProfile";

interface UserAvatarProps {
 size?: "sm" | "md" | "lg";
 showName?: boolean;
 className?: string;
}

export function UserAvatar({ size = "md", showName = false, className }: UserAvatarProps) {
 const { user, isLoading } = useUserProfile();

 if (isLoading) {
  return (
   <div className={`flex items-center gap-3 ${className}`}>
    <Skeleton className="rounded-full w-8 h-8" />
    {showName && <Skeleton className="h-4 w-20" />}
   </div>
  );
 }

 if (!user) {
  return null;
 }

 const getInitials = (name: string | null, email: string | null): string => {
  if (name) {
   const parts = name.trim().split(" ");
   if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
   }
   return name[0].toUpperCase();
  }
  if (email) {
   return email[0].toUpperCase();
  }
  return "U";
 };

 const getAvatarColor = (name: string | null, email: string | null): string => {
  const str = name || email || "User";
  const colors = [
   "bg-blue-500",
   "bg-green-500",
   "bg-purple-500",
   "bg-pink-500",
   "bg-indigo-500",
   "bg-yellow-500",
   "bg-red-500",
   "bg-cyan-500"
  ];
 
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
   hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
 };

 return (
  <div className={`flex items-center gap-3 ${className}`}>
   <Avatar
    size={size}
    src={user.image || undefined}
    name={getInitials(user.name, user.email)}
    showFallback
    className={!user.image ? getAvatarColor(user.name, user.email) : undefined}
   />
   {showName && (
    <div className="flex flex-col">
     <span className="text-sm font-medium">
      {user.name || user.email || "User"}
     </span>
     {user.name && user.email && (
      <span className="text-xs text-default-500">{user.email}</span>
     )}
    </div>
   )}
  </div>
 );
}