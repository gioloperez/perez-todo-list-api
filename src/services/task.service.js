const TaskRepo = require('../repositories/task.repository');
const ListRepo = require('../repositories/list.repository');

function getTasksByListId(listId, limit = 100, offset = 0) {
    const list = ListRepo.findById(listId);

    if(!list) {
      throw new Error('LIST_NOT_FOUND');
    }

    return TaskRepo.findTasksByListId(listId, limit, offset);
};

function createTask(listId, title) {
  const list = ListRepo.findById(listId);

  if (!list) {
    throw new Error('LIST_NOT_FOUND');
  }

  const lastTask = TaskRepo.findLastTaskInList(listId);
  const newPosition = lastTask ? lastTask.position + 1000 : 1000;

  return TaskRepo.createTask(listId, title, newPosition);
}

function updateTask(taskId, updates) {
  const MIN_POSITION_DIFFERENCE = 0.000001;

  const task = TaskRepo.findById(taskId);
  if (!task) throw new Error('TASK_NOT_FOUND');

  let newTitle = updates.title !== undefined ? updates.title : task.title;
  let newPosition = task.position;

  if (updates.afterTaskId !== undefined && parseInt(updates.afterTaskId) !== taskId) {
    const afterTask = updates.afterTaskId
      ? TaskRepo.findById(parseInt(updates.afterTaskId))
      : null;

    if (!afterTask) {
      const lastTask = TaskRepo.findLastTaskInList(task.list_id);
      newPosition = lastTask ? lastTask.position + 1000 : 1000;
    } else {
      const nextTask = TaskRepo.findNextTask(task.list_id, afterTask.position);

      newPosition = nextTask
        ? (afterTask.position + nextTask.position) / 2
        : afterTask.position + 1000;
    }
  }

  const positionChanged = Math.abs(newPosition - task.position) >= MIN_POSITION_DIFFERENCE;
  const titleChanged = newTitle !== task.title;

  if (positionChanged || titleChanged) {
    TaskRepo.updateTask(taskId, newTitle, newPosition);
  }

  return TaskRepo.findById(taskId);
}

function deleteTask(taskId) {
  const task = TaskRepo.findById(taskId);

  if (!task) throw new Error('TASK_NOT_FOUND');

  TaskRepo.deleteTask(taskId);
}

module.exports = {
  getTasksByListId,
  createTask,
  updateTask,
  deleteTask,
}
