/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Typography,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { deleteJob } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { JobType } from './Utils';

interface JobDeleteDialogProps {
  isOpen: boolean;
  onDialogOpen: () => void;
  job: JobType | null;
}

const JobDeleteDialog: FC<JobDeleteDialogProps> = ({
  isOpen,
  onDialogOpen,
  job,
}) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      onDialogOpen();
      queryClient.invalidateQueries(['jobsData']);
    },
  });

  const [jobId, setJobId] = useState('');

  const resetForm = () => {
    setJobId('');
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && job) {
      setJobId(job.id);
    }
  }, [isOpen, job]);

  const handleConfirm = () => {
    deleteMutation.mutate(jobId);
  };

  return (
    <Dialog open={isOpen} handler={onDialogOpen}>
      <DialogHeader>Delete Job</DialogHeader>
      <DialogBody divider>
        <Typography as="p" className="font-normal">
          Are you sure you want to delete this job?
        </Typography>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          color="red"
          onClick={onDialogOpen}
          className="mr-1"
        >
          <span>Cancel</span>
        </Button>
        <Button variant="gradient" color="red" onClick={handleConfirm}>
          <span>Confirm</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default JobDeleteDialog;
