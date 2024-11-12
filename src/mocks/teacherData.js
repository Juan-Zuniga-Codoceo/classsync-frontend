export const mockTeachers = [
    {
      id: 1,
      firstName: "Juan",
      lastName: "Pérez",
      email: "juan.perez@classsync.com",
      phone: "912345678",
      contractType: "fullTime",
      totalHours: 44,
      subjects: ["Matemáticas", "Física"]
    },
    {
      id: 2,
      firstName: "María",
      lastName: "González",
      email: "maria.gonzalez@classsync.com",
      phone: "923456789",
      contractType: "partTime",
      totalHours: 22,
      subjects: ["Lenguaje"]
    },
    {
      id: 3,
      firstName: "Carlos",
      lastName: "Ruiz",
      email: "carlos.ruiz@classsync.com",
      phone: "934567890",
      contractType: "fullTime",
      totalHours: 40,
      subjects: ["Historia", "Filosofía"]
    }
  ];
  
  export const mockMetrics = {
    totalTeachers: 3,
    totalCourses: 8,
    assignedHours: 106,
    averageHours: 35,
    subjectDistribution: [
      { subject: "Matemáticas", count: 4 },
      { subject: "Lenguaje", count: 3 },
      { subject: "Ciencias", count: 3 },
      { subject: "Historia", count: 2 },
      { subject: "Inglés", count: 2 }
    ],
    monthlyHours: [
      { month: "Ene", hours: 240 },
      { month: "Feb", hours: 300 },
      { month: "Mar", hours: 280 },
      { month: "Abr", hours: 320 },
      { month: "May", hours: 280 },
      { month: "Jun", hours: 300 }
    ]
  };