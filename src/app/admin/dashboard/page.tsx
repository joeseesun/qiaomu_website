import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Users, Tag, Eye, TrendingUp, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总文章数</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">
              +2 篇文章（本月）
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,203</div>
            <p className="text-xs text-muted-foreground">
              +180 浏览（本周）
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">标签数量</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              +3 标签（本月）
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">总用户数</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">
              单用户博客系统
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>流量趋势</CardTitle>
            <CardDescription>
              过去30天的网站访问量
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] flex items-center justify-center border rounded-md">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">图表区域</span>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>最近文章</CardTitle>
            <CardDescription>
              最近发布的5篇文章
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      文章标题 {i}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      <Clock className="mr-1 inline-block h-3 w-3" />
                      2023-04-{10 - i}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {120 - i * 10} 浏览
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>热门标签</CardTitle>
            <CardDescription>
              使用最多的标签
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {['JavaScript', 'React', 'Next.js', 'TypeScript', 'Node.js'].map((tag, i) => (
                <div key={tag} className="flex items-center">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {tag}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {10 - i} 篇文章
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>待办事项</CardTitle>
            <CardDescription>
              博客管理待办事项
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    更新博客主题
                  </p>
                  <p className="text-xs text-muted-foreground">
                    计划于下周完成
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    撰写新文章
                  </p>
                  <p className="text-xs text-muted-foreground">
                    关于 Next.js 的新特性
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="flex h-5 w-5 items-center justify-center rounded-full border">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>
                <div className="ml-2 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    优化网站性能
                  </p>
                  <p className="text-xs text-muted-foreground">
                    提高页面加载速度
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>系统信息</CardTitle>
            <CardDescription>
              博客系统基本信息
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">系统版本</span>
                <span className="text-sm">1.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Next.js 版本</span>
                <span className="text-sm">14.0.0</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">数据库</span>
                <span className="text-sm">SQLite</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">上次更新</span>
                <span className="text-sm">2023-04-04</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">服务器状态</span>
                <span className="text-sm text-green-500">正常</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
