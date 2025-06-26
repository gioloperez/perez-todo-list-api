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
  const task = TaskRepo.findById(taskId);
  if (!task) throw new Error('TASK_NOT_FOUND');

  let newTitle = updates.title !== undefined ? updates.title : task.title;
  let newPosition = task.position;
  let positionChanged = false;

  if (updates.afterTaskId !== undefined && parseInt(updates.afterTaskId) !== taskId) {
    const afterTask = updates.afterTaskId
      ? TaskRepo.findById(parseInt(updates.afterTaskId))
      : null;

    if (!afterTask) {
      const lastTask = TaskRepo.findLastTaskInList(task.list_id);
      const expectedPosition = lastTask ? lastTask.position + 1000 : 1000;

      if (task.position !== expectedPosition) {
        newPosition = expectedPosition;
        positionChanged = true;
      }
    } else {
      const nextTask = TaskRepo.findNextTask(task.list_id, afterTask.position);

      // Guard clause: If task is already the "next" one, skip
      if (nextTask && nextTask.id === task.id) {
        // Do nothing
      } else {
        const afterPosition = afterTask.position;
        const nextPosition  = nextTask ? nextTask.position : afterPosition + 2000;
        const isOutOfPlace = !(task.position > afterPosition && task.position < nextPosition);

        if (isOutOfPlace) {
          newPosition = nextTask
            ? (afterTask.position + nextTask.position) / 2
            : afterTask.position + 1000;

          positionChanged = true;
        }
      }
    }
  }

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
