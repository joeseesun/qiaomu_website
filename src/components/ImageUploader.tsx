'use client';

import { useState, useRef, useEffect, ChangeEvent } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, Upload, X, Clipboard } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  label?: string;
  placeholder?: string;
}

export default function ImageUploader({
  value,
  onChange,
  className = '',
  label = '上传图片',
  placeholder = '选择、拖放或粘贴图片到此处'
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await uploadFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files?.length) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        await uploadFile(file);
      } else {
        setError('请上传图片文件');
      }
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  // 处理粘贴事件
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      // 允许在整个页面上粘贴图片
      // 不再限制必须在上传区域内粘贴
      // if (!dropAreaRef.current?.contains(document.activeElement)) return;

      // 检查剪贴板是否包含图片
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault(); // 阻止默认粘贴行为

          const file = items[i].getAsFile();
          if (!file) continue;

          toast({
            title: "正在处理",
            description: "正在上传粘贴的图片...",
            duration: 2000,
          });

          await uploadFile(file);
          break;
        }
      }
    };

    // 添加粘贴事件监听器
    document.addEventListener('paste', handlePaste);

    // 清理函数
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, [toast]);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '上传失败');
      }

      const data = await response.json();
      onChange(data.file.url);

      toast({
        title: "上传成功",
        description: "图片已成功上传",
        duration: 2000,
      });
    } catch (err: any) {
      console.error('上传图片失败:', err);
      setError(err.message || '上传图片失败');

      toast({
        title: "上传失败",
        description: err.message || "图片上传失败，请重试",
        variant: "destructive",
        duration: 2000,
      });
    } finally {
      setIsUploading(false);
      // 清空文件输入，以便可以重新选择相同的文件
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleClear = () => {
    onChange('');
    setError('');
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-sm text-gray-600 mb-1">{label}</label>}

      {value ? (
        <div className="relative border rounded-md overflow-hidden">
          <Image
            src={value}
            alt="封面图片"
            width={300}
            height={200}
            className="w-full object-cover h-[200px]"
          />
          <button
            onClick={handleClear}
            className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70 transition-all"
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <div
          ref={dropAreaRef}
          className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          tabIndex={0} // 使div可聚焦，以便捕获粘贴事件
        >
          {isUploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">上传中...</p>
            </div>
          ) : (
            <>
              <Upload className="h-8 w-8 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">{placeholder}</p>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                >
                  选择图片
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  className="flex items-center gap-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast({
                      title: "粘贴提示",
                      description: "请使用 Ctrl+V / Cmd+V 粘贴图片",
                      duration: 2000,
                    });
                  }}
                >
                  <Clipboard size={14} />
                  <span>粘贴图片</span>
                </Button>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                支持拖放或直接粘贴图片（Ctrl+V / Cmd+V）
              </p>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </div>
      )}

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
