export const jobIndustryMap: { [x: string | number]: string } = {
  0: 'None',
  1: 'IT',
  2: 'Tech Support',
  3: 'Human Resource',
  4: 'Accounting',
  5: 'Sales and Marketing',
  6: 'Hospitality',
  7: 'Manpower',
  8: 'Finance',
};

export type JobType = {
  id: string;
  title: string;
  description: string;
  industry: number;
  noOfOpenings: number;
};
