
import { useState } from "react";
import { 
  Home, 
  Music, 
  TrendingUp, 
  Heart, 
  Search, 
  Settings,
  Menu,
  X
} from "lucide-react";
import {
  Sidebar as SidebarUI,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { id: 'feed', title: 'News Feed', icon: Home },
  { id: 'music', title: 'Music', icon: Music },
  { id: 'trending', title: 'Trending', icon: TrendingUp },
  { id: 'favorites', title: 'Favorites', icon: Heart },
  { id: 'search', title: 'Search', icon: Search },
  { id: 'settings', title: 'Settings', icon: Settings },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isAuthenticated: boolean;
}

export function Sidebar({ activeSection, onSectionChange, isAuthenticated }: SidebarProps) {
  const { collapsed } = useSidebar();

  return (
    <SidebarUI className={`${collapsed ? 'w-16' : 'w-64'} transition-all duration-300 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-r border-slate-200 dark:border-slate-700`}>
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <SidebarTrigger className="mb-2" />
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">CD</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Content Dashboard
            </h1>
          </div>
        )}
      </div>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className={`${collapsed ? 'sr-only' : ''} text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2`}>
            Main Navigation
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = activeSection === item.id;
                const needsAuth = ['favorites', 'settings'].includes(item.id);
                
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton 
                      asChild
                      className={`
                        w-full transition-all duration-200 rounded-lg
                        ${isActive 
                          ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }
                        ${needsAuth && !isAuthenticated ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                      `}
                    >
                      <button
                        onClick={() => {
                          if (needsAuth && !isAuthenticated) return;
                          onSectionChange(item.id);
                        }}
                        className="flex items-center space-x-3 p-3 w-full text-left"
                        disabled={needsAuth && !isAuthenticated}
                      >
                        <item.icon className={`w-5 h-5 ${collapsed ? 'mx-auto' : ''}`} />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarUI>
  );
}
