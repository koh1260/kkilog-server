import { Repository } from 'typeorm';

export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(
  () => ({
    // findOne: jest.fn(entity => entity),
  }),
);
export type MockType<T> = {
  [P in keyof T]?: jest.Mock<object>;
};
