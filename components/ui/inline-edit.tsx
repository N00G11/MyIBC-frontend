import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, X, Edit } from 'lucide-react';

interface InlineEditProps {
  initialValue: string;
  onSave: (newValue: string) => Promise<boolean>;
  onCancel?: () => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function InlineEdit({ 
  initialValue, 
  onSave, 
  onCancel, 
  placeholder = "Entrez un nom",
  className = "",
  disabled = false
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSave = async () => {
    if (value.trim() === initialValue.trim()) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    const success = await onSave(value.trim());
    setIsSaving(false);

    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setValue(initialValue);
    setIsEditing(false);
    onCancel?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  };

  if (!isEditing) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="flex-1">{initialValue}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          disabled={disabled}
          className="h-6 w-6 p-0"
        >
          <Edit className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1"
        autoFocus
        disabled={isSaving}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        disabled={isSaving || !value.trim()}
        className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
      >
        <Check className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleCancel}
        disabled={isSaving}
        className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
