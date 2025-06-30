import { Flex, Title } from "rizzui";

const Header = () => {
  return (
    <Flex justify="between" align="center" className="mb-6">
      <Title as="h1" className="text-base font-semibold sm:text-lg xl:text-xl">
        Overview
      </Title>
    </Flex>
  );
};

export default Header;
