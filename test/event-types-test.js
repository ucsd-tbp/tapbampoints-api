describe('Event Types', function() {
  describe('GET /event-types', function() {
    it('returns a list of event types');
  });

  describe('GET /event-types/:id', function() {
    it('returns the event type with the correct ID');
    it('responds with a 404 NOT FOUND with a nonexistent ID');
  });

  describe('POST /event-types', function() {
    it('responds with a 201 CREATED');
    it('creates a new event-type');
  });

  describe('PATCH /event-types/:id', function() {
    it('updates the event-type\'s name and description');
  });

  describe('DELETE /event-types/:id', function() {
    it('responds with a 204 NO CONTENT');
    it('deletes the event-type');
  });
});
