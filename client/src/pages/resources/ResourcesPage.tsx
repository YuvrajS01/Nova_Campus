import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout';
import { Card, Input } from '@/components/ui';
import { PullToRefresh } from '@/components/ui';
import { FileText, PlayCircle, Link as LinkIcon, Download, Search, File } from 'lucide-react';
import { resourcesApi, Resource } from '@/services/api';

const getIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case 'pdf': return <FileText className="text-red-500" />;
    case 'video': return <PlayCircle className="text-brand-500" />;
    case 'link': return <LinkIcon className="text-blue-500" />;
    default: return <File className="text-gray-500" />;
  }
};

export const Resources: React.FC = () => {
  const [query, setQuery] = useState('');
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchResources = async () => {
    try {
      const data = await resourcesApi.getAll();
      setResources(data);
    } catch (error) {
      console.error('Failed to fetch resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchResources();
  };

  const filteredResources = resources.filter(r =>
    r.title.toLowerCase().includes(query.toLowerCase()) ||
    r.subject.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <PullToRefresh onRefresh={handleRefresh}>
      <div className="space-y-4">
        <Header title="Library" />

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search materials, papers..."
            className="pl-10"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-3">
          {isLoading ? (
            <div className="text-center py-12 text-gray-400">Loading resources...</div>
          ) : filteredResources.length > 0 ? (
            filteredResources.map((resource) => (
              <Card
                key={resource.id}
                className="flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-surface2 transition-colors cursor-pointer"
                noPadding
              >
                <div className="p-4 flex-1 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-dark-bg flex items-center justify-center shrink-0">
                    {getIcon(resource.type)}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{resource.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {resource.subject} • {resource.type.toUpperCase()} • {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pr-4 text-gray-400 hover:text-brand-500 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={20} />
                </a>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 text-gray-400">No resources found</div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
};