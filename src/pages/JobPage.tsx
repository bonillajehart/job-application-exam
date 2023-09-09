import { useState } from 'react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PaperAirplaneIcon,
} from '@heroicons/react/20/solid';
import {
  Typography,
  Select,
  Button,
  Spinner,
  Card,
  Option,
  Input,
} from '@material-tailwind/react';
import { useQuery } from '@tanstack/react-query';
import { getAllJobs } from '../api';
import { jobIndustryMap, JobType } from '../components/Jobs/Utils';
import JobFormDialog from '../components/Jobs/JobFormDialog';
import JobDeleteDialog from '../components/Jobs/JobDeleteDialog';
import JobApplyDialog from '../components/Jobs/JobApplyDialog';

const TABLE_HEAD = [
  'title',
  'description',
  'industry',
  'number of openings',
  '',
];

const JobPage = () => {
  const [editJob, setEditJob] = useState<null | JobType>(null);
  const [deleteJob, setDeleteJob] = useState<null | JobType>(null);
  const [applyJob, setApplyJob] = useState<null | JobType>(null);

  const [jobFormDialogOpen, setJobFormDialogOpen] = useState(false);
  const handleJobFormDialogOpen = () => {
    setJobFormDialogOpen(!jobFormDialogOpen);
  };

  const [jobDeleteDialogOpen, setJobDeleteDialogOpen] = useState(false);
  const handleJobDeleteDialogOpen = () => {
    setJobDeleteDialogOpen(!jobDeleteDialogOpen);
  };

  const [jobApplyDialogOpen, setJobApplyDialogOpen] = useState(false);
  const handleJobApplyDialogOpen = () => {
    setJobApplyDialogOpen(!jobApplyDialogOpen);
  };

  const [typingTimeout, setTypingTimeout] = useState<null | NodeJS.Timeout>(
    null
  );
  const [searchKeywordFilter, setSearchKeywordFilter] = useState<string>('');
  const [selectedIndustryFilter, setSelectedIndustryFilter] =
    useState<string>('none');

  const { isLoading, error, data, isFetching } = useQuery<JobType[]>({
    queryKey: ['jobsData', selectedIndustryFilter, searchKeywordFilter],
    queryFn: () =>
      getAllJobs(
        searchKeywordFilter,
        selectedIndustryFilter === 'none' ? undefined : selectedIndustryFilter
      ),
  });

  const handleEditJob = (job: JobType) => {
    setEditJob(job);
    handleJobFormDialogOpen();
  };

  const handleCreateJob = () => {
    setEditJob(null);
    handleJobFormDialogOpen();
  };

  const handleDeleteJob = (job: JobType) => {
    setDeleteJob(job);
    handleJobDeleteDialogOpen();
  };

  const handleApplyJob = (job: JobType) => {
    setApplyJob(job);
    handleJobApplyDialogOpen();
  };

  const handleSearchJob = (searchQuery: string) => {
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTypingTimeout = setTimeout(() => {
      setSearchKeywordFilter(searchQuery);
    }, 300);

    setTypingTimeout(newTypingTimeout);
  };

  const renderJobsData = () => {
    if (data && data.length) {
      return data.map(({ id, title, description, industry, noOfOpenings }) => (
        <tr key={id} className="even:bg-blue-gray-50/50">
          <td className="p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal max-xs"
            >
              {title}
            </Typography>
          </td>
          <td className="p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal w-sm max-w-sm"
            >
              {description}
            </Typography>
          </td>
          <td className="p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal max-w-xs"
            >
              {jobIndustryMap[industry]}
            </Typography>
          </td>
          <td className="p-4">
            <Typography
              variant="small"
              color="blue-gray"
              className="font-normal max-w-xs"
            >
              {noOfOpenings}
            </Typography>
          </td>
          <td className="p-4">
            <Button
              variant="gradient"
              color="green"
              className="flex items-center mb-2"
              size="sm"
              onClick={() =>
                handleApplyJob({
                  id,
                  title,
                  description,
                  noOfOpenings,
                  industry,
                })
              }
            >
              <PaperAirplaneIcon strokeWidth={2} className="h-4 w-4 mr-2" />{' '}
              Apply
            </Button>
            <Button
              variant="gradient"
              color="blue"
              className="flex items-center mb-2"
              size="sm"
              onClick={() =>
                handleEditJob({
                  id,
                  title,
                  description,
                  noOfOpenings,
                  industry,
                })
              }
            >
              <PencilIcon strokeWidth={2} className="h-4 w-4 mr-2" /> Edit
            </Button>
            <Button
              variant="gradient"
              color="red"
              className="flex items-center"
              size="sm"
              onClick={() =>
                handleDeleteJob({
                  id,
                  title,
                  description,
                  noOfOpenings,
                  industry,
                })
              }
            >
              <TrashIcon strokeWidth={2} className="h-4 w-4 mr-2" /> Delete
            </Button>
          </td>
        </tr>
      ));
    }

    return (
      <tr className="even:bg-blue-gray-50/50">
        <td colSpan={4} className="p-4">
          <Typography
            variant="small"
            color="blue-gray"
            className="font-normal text-center"
          >
            {error
              ? 'Something went wrong please try again.'
              : 'No matching Job found'}
          </Typography>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className="container max-w-6xl mx-auto mt-10">
        <div className="flex flex-col">
          {/* Title and controls */}
          <div className="flex items-center justify-between mb-10">
            {/* Title */}
            <div>
              <Typography as="h3" className="text-xl font-medium">
                Jobs
              </Typography>
              <Typography as="p" className="text-left text-gray-400">
                List of all available jobs to apply
              </Typography>
            </div>
            {/* Controls */}
            <div className="flex space-x-6">
              <Button
                variant="gradient"
                color="blue"
                className="flex items-center"
                size="sm"
                onClick={handleCreateJob}
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4 mr-2" /> Add Job
              </Button>
            </div>
          </div>
          <div className="flex items-center space-x-3 mb-4">
            <div className="max-w-md">
              <Input
                label="Search Job"
                crossOrigin={undefined}
                onChange={(e) => handleSearchJob(e.target.value)}
              />
            </div>
            <div className="max-w-md">
              <Select
                label="Filter Industry by:"
                onChange={(newInstustryFilter) =>
                  setSelectedIndustryFilter(newInstustryFilter || 'none')
                }
                selected={() => jobIndustryMap[selectedIndustryFilter]}
              >
                {Object.keys(jobIndustryMap).map((jobIndustryKey) => (
                  <Option key={jobIndustryKey} value={jobIndustryKey}>
                    {jobIndustryMap[jobIndustryKey]}
                  </Option>
                ))}
              </Select>
            </div>
          </div>
        </div>
        {isLoading || isFetching ? (
          <Spinner className="h-12 w-12" />
        ) : (
          <div>
            <Card className="h-full w-full overflow-auto">
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70 capitalize"
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderJobsData()}</tbody>
              </table>
            </Card>
          </div>
        )}
      </div>

      <JobFormDialog
        isOpen={jobFormDialogOpen}
        onDialogOpen={handleJobFormDialogOpen}
        job={editJob}
      />

      <JobDeleteDialog
        isOpen={jobDeleteDialogOpen}
        onDialogOpen={handleJobDeleteDialogOpen}
        job={deleteJob}
      />

      <JobApplyDialog
        isOpen={jobApplyDialogOpen}
        onDialogOpen={handleJobApplyDialogOpen}
        job={applyJob}
      />
    </>
  );
};

export default JobPage;
