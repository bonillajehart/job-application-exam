/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  Textarea,
  Select,
  DialogFooter,
  Button,
  Input,
  Option,
  Typography,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { jobIndustryMap } from './Utils';
import { createJob, updateJob } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { JobType } from './Utils';

interface JobFormDialogProps {
  isOpen: boolean;
  onDialogOpen: () => void;
  job: JobType | null;
}

const JobFormDialog: FC<JobFormDialogProps> = ({
  isOpen,
  onDialogOpen,
  job,
}) => {
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      onDialogOpen();
      queryClient.invalidateQueries(['jobsData']);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateJob,
    onSuccess: () => {
      onDialogOpen();
      queryClient.invalidateQueries(['jobsData']);
    },
  });

  const [jobId, setJobId] = useState('');

  // required | max: 50
  const [title, setTitle] = useState('');

  // required | max: 300
  const [description, setDescription] = useState('');

  // required
  const [industry, setIndustry] = useState<number | undefined>(0);

  // most be a number and greater than zero
  const [noOfOpenings, setNoOfOpenings] = useState<number | undefined>(
    undefined
  );

  const [errorMessages, setErrorMessages] = useState<Record<string, any>>({});

  const resetForm = () => {
    setErrorMessages({});
    setTitle('');
    setDescription('');
    setIndustry(0);
    setNoOfOpenings(undefined);
    setJobId('');
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && job) {
      setTitle(job.title);
      setDescription(job.description);
      setIndustry(job.industry);
      setNoOfOpenings(job.noOfOpenings);
      setJobId(job.id);
    }
  }, [isOpen, job]);

  const isValidData = () => {
    const newErrorMessages: Record<string, any> = {};
    if (!title.trim().length) {
      newErrorMessages.title = 'Title is required';
    }

    if (title.trim().length > 50) {
      newErrorMessages.title = 'Max length of title is 50 characters';
    }

    console.log(description, '[DESCRIPTION/?]');

    if (!description.trim().length) {
      newErrorMessages.description = 'Description is required';
    }

    if (description.trim().length > 300) {
      newErrorMessages.description =
        'Max length of description is 50 characters';
    }

    if (industry === 0 || !industry) {
      newErrorMessages.industry = 'Industry is required';
    }

    console.log(noOfOpenings, '[No of openings]');
    if (!Number.isInteger(noOfOpenings)) {
      newErrorMessages.noOfOpenings = 'No of Openings must be a number';
    }

    if (noOfOpenings && noOfOpenings < 0) {
      newErrorMessages.noOfOpenings = 'No of Openings must be greater than 0';
    }

    setErrorMessages(newErrorMessages);

    return Object.keys(newErrorMessages).length <= 0;
  };

  const handleConfirm = () => {
    if (isValidData()) {
      if (jobId.length) {
        updateMutation.mutate({
          id: jobId,
          title,
          description,
          industry,
          noOfOpenings,
        });
      } else {
        createMutation.mutate({ title, description, industry, noOfOpenings });
      }
    }
  };

  return (
    <Dialog open={isOpen} handler={onDialogOpen}>
      <DialogHeader>{jobId.length ? 'Edit Job' : 'Add Job'}</DialogHeader>
      <DialogBody divider>
        <div className="mb-4 flex flex-col gap-6">
          <div>
            <Input
              label="Title"
              crossOrigin={undefined}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errorMessages.title}
              defaultValue={title}
            />
            {!!errorMessages.title && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.title}
              </Typography>
            )}
          </div>
          <div>
            <Textarea
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              error={!!errorMessages.description}
              defaultValue={description}
            />
            {!!errorMessages.description && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.description}
              </Typography>
            )}
          </div>
          <div>
            <Select
              label="Industry"
              onChange={(chosenIndustry) =>
                setIndustry(parseInt(chosenIndustry || '0'))
              }
              error={!!errorMessages.industry}
              value={String(industry) || '0'}
            >
              {Object.keys(jobIndustryMap)
                .filter((jobIndustryKey) => jobIndustryKey !== '0')
                .map((jobIndustryKey) => (
                  <Option key={jobIndustryKey} value={jobIndustryKey}>
                    {jobIndustryMap[jobIndustryKey]}
                  </Option>
                ))}
            </Select>
            {!!errorMessages.industry && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.industry}
              </Typography>
            )}
          </div>

          <div>
            <Input
              type="number"
              size="md"
              label="Number of openings"
              crossOrigin={undefined}
              onChange={(e) => setNoOfOpenings(parseInt(e.target.value))}
              error={!!errorMessages.noOfOpenings}
              defaultValue={noOfOpenings}
            />
            {!!errorMessages.noOfOpenings && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.noOfOpenings}
              </Typography>
            )}
          </div>
        </div>
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
        <Button variant="gradient" color="green" onClick={handleConfirm}>
          <span>{jobId.length ? 'Update' : 'Confirm'}</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default JobFormDialog;
