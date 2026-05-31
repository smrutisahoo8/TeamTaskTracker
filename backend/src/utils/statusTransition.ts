import { TaskStatus } from '../constants/taskStatus';

const allowedTransitions: Record<TaskStatus, TaskStatus[]> = {
  [TaskStatus.TODO]: [TaskStatus.IN_PROGRESS, TaskStatus.BLOCKED],
  [TaskStatus.IN_PROGRESS]: [TaskStatus.IN_REVIEW, TaskStatus.BLOCKED],
  [TaskStatus.IN_REVIEW]: [TaskStatus.DONE, TaskStatus.BLOCKED],
  [TaskStatus.DONE]: [],
  [TaskStatus.BLOCKED]: [],
};

export const validateStatusTransition = (
  current: TaskStatus,
  next: TaskStatus
) => {
  if (!allowedTransitions[current]?.includes(next)) {
    throw {
      status: 400,
      code: 'INVALID_STATUS_TRANSITION',
      message: `Cannot change status from ${current} to ${next}`,
    };
  }
};