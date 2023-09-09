import { Navbar, Typography } from '@material-tailwind/react';

const Header = () => {
  return (
    <Navbar className="sticky max-w-full top-0 z-10 h-max rounded-none py-2 px-4 lg:px-8 lg:py-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between text-blue-gray-900">
          <Typography
            as="a"
            href="#"
            className="mr-4 cursor-pointer py-1.5 font-medium text-2xl"
          >
            Job Application Website
          </Typography>
        </div>
      </div>
    </Navbar>
  );
};

export default Header;
