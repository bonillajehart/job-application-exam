/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useEffect, useState } from 'react';
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
  Input,
  Typography,
} from '@material-tailwind/react';
import { useMutation } from '@tanstack/react-query';
import { applyJob } from '../../api';
import { useQueryClient } from '@tanstack/react-query';
import { JobType } from './Utils';

interface JobApplyDialogProps {
  isOpen: boolean;
  onDialogOpen: () => void;
  job: JobType | null;
}

const JobApplyDialog: FC<JobApplyDialogProps> = ({
  isOpen,
  onDialogOpen,
  job,
}) => {
  const [serverError, setServerError] = useState('');
  const queryClient = useQueryClient();
  const createMutation = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      onDialogOpen();
      queryClient.invalidateQueries(['jobsData']);
    },
    onError: (error) => {
      setServerError((error as any).response?.data);
    },
  });

  // required
  const [firstname, setFirstname] = useState('');

  // required
  const [lastname, setLastname] = useState('');

  // required
  const [email, setEmail] = useState('');

  const [errorMessages, setErrorMessages] = useState<Record<string, any>>({});

  const resetForm = () => {
    setErrorMessages({});
    setFirstname('');
    setLastname('');
    setEmail('');
  };

  useEffect(() => {
    resetForm();
  }, [isOpen]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const isValidData = () => {
    const newErrorMessages: Record<string, any> = {};
    if (!firstname.trim().length) {
      newErrorMessages.firstname = 'Firstname is required';
    }

    if (!lastname.trim().length) {
      newErrorMessages.lastname = 'Lastname is required';
    }

    if (!validateEmail(email)) {
      newErrorMessages.email = 'Please enter a valid email';
    }

    if (!email.trim().length) {
      newErrorMessages.email = 'Email is required';
    }

    setErrorMessages(newErrorMessages);

    return Object.keys(newErrorMessages).length <= 0;
  };

  const handleConfirm = () => {
    if (isValidData()) {
      createMutation.mutate({
        applicantDetails: {
          fullName: `${firstname} ${lastname}`,
          emailAddress: email,
        },
        jobId: job?.id,
      });
    }
  };

  return (
    <Dialog open={isOpen} handler={onDialogOpen}>
      <DialogHeader>Apply for: {job?.title}</DialogHeader>
      <DialogBody divider>
        <div className="mb-4 flex flex-col gap-6">
          {!!serverError && (
            <Typography
              variant="small"
              color="red"
              className="flex items-center gap-1 font-normal"
            >
              {serverError}
            </Typography>
          )}
          <Typography variant="small">
            Please enter applicant details
          </Typography>
          <div>
            <Input
              label="Firstname"
              crossOrigin={undefined}
              onChange={(e) => setFirstname(e.target.value)}
              error={!!errorMessages.firstname}
              defaultValue={firstname}
            />
            {!!errorMessages.firstname && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.firstname}
              </Typography>
            )}
          </div>
          <div>
            <Input
              label="Lastname"
              crossOrigin={undefined}
              onChange={(e) => setLastname(e.target.value)}
              error={!!errorMessages.lastname}
              defaultValue={lastname}
            />
            {!!errorMessages.lastname && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.lastname}
              </Typography>
            )}
          </div>
          <div>
            <Input
              label="Email"
              crossOrigin={undefined}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errorMessages.email}
              defaultValue={email}
            />
            {!!errorMessages.email && (
              <Typography
                variant="small"
                color="red"
                className="flex items-center gap-1 font-normal"
              >
                {errorMessages.email}
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
          <span>Apply</span>
        </Button>
      </DialogFooter>
    </Dialog>
  );
};

export default JobApplyDialog;
