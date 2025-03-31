import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button.tsx';
import { Input } from '../ui/input.tsx';
import { Label } from '../ui/label.tsx';

interface PrivacySettingsProps {
  initialSettings: {
    startTime: string;
    endTime: string;
  };
  onSave: (schedule: { startTime: string; endTime: string }) => void;
}

export const PrivacySettings: React.FC<PrivacySettingsProps> = ({
  initialSettings,
  onSave
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: initialSettings
  });

  const onSubmit = (data: { startTime: string; endTime: string }) => {
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div>
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            {...register('startTime', { required: true })}
          />
        </div>
        <div>
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            {...register('endTime', { required: true })}
          />
        </div>
        <Button type="submit">Save</Button>
      </div>
    </form>
  );
};
