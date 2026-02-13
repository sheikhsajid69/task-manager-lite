import joi from 'joi'; 

const createTaskSchema = joi.object({   
    title: joi.string().required(),
    description: joi.string().allow("").optional(),
    status: joi.string().valid('pending', 'in-progress', 'completed'),
    priority: joi.string().valid('low', 'medium', 'high'),
    dueDate: joi.date(),
    userId: joi.string().required(),
});

export const updateTaskSchema = joi.object({   
    title: joi.string(),
    description: joi.string().allow(""),
    status: joi.string().valid('pending', 'in-progress', 'completed'),
    priority: joi.string().valid('low', 'medium', 'high'),
    dueDate: joi.date(),
}).min(1);

export default createTaskSchema;