import type { Task } from "../models/Task";

export const tasksMock: Task[] = [
  {
    id: "1",
    title: "Desarrollar la aplicación de tareas",
    description: "Hacer esqueleto",
    category: "Estudio",
    status: { id: "1", name: "To Do", color: "#FF0000", active: true },
    priority: { id: "1", name: "High", color: "bg-red-500" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "2",
    title: "Configuración del entorno de desarrollo",
    description: "Configurar el entorno de desarrollo para el proyecto",
    category: "Estudio",
    status: { id: "2", name: "In Progress", color: "#00FF00", active: true },
    priority: { id: "2", name: "Medium", color: "bg-yellow-500" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "3",
    title: "Escribir documentación del proyecto",
    description: "Escribir documentación del proyecto",
    category: "Estudio",
    status: { id: "3", name: "Done", color: "#0000FF", active: true },
    priority: { id: "3", name: "Low", color: "bg-sky-300" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "4",
    title: "Configuración de conexión a base de datos",
    description: "Configurar conexión a base de datos",
    category: "Estudio",
    status: { id: "1", name: "To Do", color: "#FF0000", active: true },
    priority: { id: "1", name: "High", color: "bg-red-500" },
    createdAt: new Date(),
    updatedAt: new Date()
  },
];