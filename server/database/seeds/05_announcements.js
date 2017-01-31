exports.seed = (knex, Promise) =>
  knex('announcements').del().then(() =>
    Promise.all([
      knex('announcements').insert({
        id: 1,
        summary: 'Pi Day Committee',
        description: 'Each year, Tau Beta Pi hosts an all campus event to celebrate pi day, ' +
          'which includes free food, games, and a pie drop! The Pi Day committee is responsible ' +
          'for planning this event. It is an opportunity for you to develop leadership and ' +
          'teamwork skills, and a great opportunity for those of you interested in becoming ' +
          'officers next year. If you are interested, please fill out the form below, and if you ' +
          'have any questions, feel free to contact JR at jrz002@ucsd.edu.',
      }),

      knex('announcements').insert({
        id: 2,
        summary: 'Tutoring',
        description: 'Interested in tutoring your fellow students in STEM fields? The IDEA ' +
          'Learning Center is looking to add 1 on 1 tutors to their services, for classes ' +
          'including but not limited to CHEM 6A-6C, PHYS 2A-2C, MATH 20A-20C, and potentially ' +
          'CSE lower divisions. All tutoring will be in the IDEA study center in EBU1 ' +
          'Basement, and all assignments will be made via this Google Form. 1 pt/hr Community ' +
          'Service will be offered for tutoring.',
      }),

      knex('announcements').insert({
        id: 3,
        summary: 'Non-TBP Hosted Events For Points',
        description: 'Events not hosted by Tau Beta Pi or not listed on our calendar, may still ' +
        'be eligible for points. In order to receive points for these events, members and/or ' +
        'initiates must write a one-page write up of the event, including an event description ' +
        'as well as why you believe it should count as an event and how it follows TBP\'s goals. ' +
        'A picture must also be shown as proof of event attendance. You will then need to email ' +
        'the write-up to an officer for approval before getting the points signed off and just ' +
        'include the picture with that.',
      }),
    ])
);
