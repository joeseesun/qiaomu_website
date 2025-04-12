'use client';
import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, FolderOpen, Tag, Settings, Image, Plus } from 'lucide-react';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Call our custom logout API
      await fetch('/api/logout', {
        method: 'POST',
      });
      
      // Also sign out from NextAuth
      await signOut({ redirect: false });
      
      // Redirect to login page
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Admin dashboard cards
  const adminCards = [
    {
      title: '文章管理',
      description: '创建、编辑和管理博客文章',
      icon: FileText,
      href: '/admin/posts',
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: '分类管理',
      description: '管理文章分类',
      icon: FolderOpen,
      href: '/admin/categories',
      color: 'bg-green-100 text-green-700',
    },
    {
      title: '标签管理',
      description: '管理文章标签',
      icon: Tag,
      href: '/admin/tags',
      color: 'bg-amber-100 text-amber-700',
    },
    {
      title: '媒体管理',
      description: '上传和管理媒体文件',
      icon: Image,
      href: '/admin/media',
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: '系统设置',
      description: '配置博客设置',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">仪表盘</h1>
        <Link href="/admin/posts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新建文章
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-md ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="mt-2">{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href={card.href}>
                <Button className="w-full">
                  进入管理
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {session?.user?.email && (
        <div className="mt-8 text-muted-foreground">
          当前登录账号: {session.user.email}
        </div>
      )}
    </div>
  );
}
