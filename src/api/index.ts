import Axios from 'axios';

const axios = Axios.create({
  baseURL: 'https://codev-job-board-app.azurewebsites.net/api/',
  timeout: 1000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getAllJobs = (
  searchKeyword?: string,
  selectedIndustryFilter?: string
) => {
  if (searchKeyword || selectedIndustryFilter) {
    return axios
      .get('/Job/filter', {
        params: {
          keyword: searchKeyword,
          jobIndustryType: selectedIndustryFilter,
        },
      })
      .then((res) => res.data);
  }
  return axios.get('/Job/getAll').then((res) => res.data);
};

export const createJob = (jobObject = {}) => {
  return axios.post('/Job/insert', jobObject);
};

export const updateJob = (jobObject = {}) => {
  return axios.put('/Job/update', jobObject);
};

export const deleteJob = (jobId = '') => {
  return axios.delete('/Job/delete', {
    params: {
      id: jobId,
    },
  });
};

export const applyJob = ({ applicantDetails = {}, jobId = '' }) => {
  return axios.post(`/JobApplicant/applyjob/${jobId}`, applicantDetails);
};
