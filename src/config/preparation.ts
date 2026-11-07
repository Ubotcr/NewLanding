export const preparation = {
  selectorLabel: "Elige tu preparación",
  selectorUrl: "/#preparacion",
  choices: [
    {
      id: "estandarizadas",
      name: "Estandarizadas",
      page: "/estandarizadas",
      app: "https://estandarizadas.ubotcr.com",
      entryLabel: "Entrar a Estandarizadas",
      description:
        "Prepara Matemáticas para las Pruebas Nacionales Estandarizadas con práctica por tema, tutor y materiales de repaso, según disponibilidad.",
    },
    {
      id: "admision",
      name: "Admisión",
      page: "/admision",
      app: "https://chat.ubotcr.com",
      entryLabel: "Entrar a Admisión",
      description:
        "Prepárate con Ubot: diagnóstico, simulacros y ejercicios de razonamiento para Admisión UCR, UNA y TEC.",
    },
  ],
} as const;

export const [estandarizadas, admision] = preparation.choices;

export const mathFeatures = [
  {
    title: "Práctica por tema",
    description:
      "Elige entre los temas con preguntas disponibles y resuelve una práctica corta.",
  },
  {
    title: "Tutor de Matemáticas",
    description:
      "Consulta una duda, pide un ejemplo o revisa tu razonamiento con el tutor.",
  },
  {
    title: "Examen diario",
    description:
      "Vuelve a practicar con la actividad diaria cuando esté habilitada en el catálogo.",
  },
  {
    title: "Materiales y resultados",
    description:
      "Repasa los documentos disponibles y consulta el resultado de una práctica.",
  },
];

export const sharedFaq = {
  frontmatter: {
    enable: true,
    title: "Antes de empezar",
    faq_list: [
      {
        question: "¿Cuál preparación elijo?",
        answer:
          "Elige Estandarizadas si buscas practicar contenidos de Matemáticas de secundaria para las Pruebas Nacionales Estandarizadas. Elige Admisión si quieres practicar razonamiento y prepararte para el ingreso a la UCR, UNA o TEC.",
      },
      {
        question: "¿Qué incluye Estandarizadas hoy?",
        answer:
          "Es un piloto de Matemáticas para secundaria académica diurna. Las prácticas por tema, el tutor, el examen diario y los materiales dependen de lo que esté habilitado en el catálogo. Consulta los temas disponibles al entrar.",
      },
      {
        question: "¿Puedo seguir usando Admisión?",
        answer:
          "Sí. Aunque la temporada de admisión terminó, sus herramientas siguen disponibles para que continués practicando a tu ritmo.",
      },
      {
        question: "¿Dónde consulto los planes y beneficios?",
        answer:
          "La página de precios detalla los planes y beneficios de Ubot Admisión. Para conocer el alcance actual del piloto de Matemáticas, visita la página de Estandarizadas.",
      },
    ],
  },
};

export const mathFaq = {
  frontmatter: {
    enable: true,
    title: "Sobre el piloto de Matemáticas",
    faq_list: [
      {
        question: "¿Para quién es este piloto?",
        answer:
          "Está dirigido a estudiantes de secundaria académica diurna que quieren practicar Matemáticas para las Pruebas Nacionales Estandarizadas.",
      },
      {
        question: "¿Cómo entro?",
        answer:
          "Entrá a la app de Estandarizadas e iniciá sesión para consultar el catálogo y elegir una actividad o tema disponible.",
      },
      {
        question: "¿Qué pasa si no encuentro un tema o actividad?",
        answer:
          "El piloto muestra los temas, preguntas, documentos y actividades habilitados en su catálogo. La disponibilidad puede variar y no implica cobertura completa del temario.",
      },
      {
        question: "¿Hay otras materias o simulacros completos?",
        answer:
          "Por ahora, la preparación que presentamos es el piloto de Matemáticas, con práctica por tema y actividades según disponibilidad. Otras materias y simulacros completos quedan fuera del alcance actual del piloto.",
      },
      {
        question: "¿Es una plataforma oficial del MEP?",
        answer:
          "Ubot ofrece preparación. Sus prácticas y resultados no constituyen resultados oficiales del MEP.",
      },
    ],
  },
};
