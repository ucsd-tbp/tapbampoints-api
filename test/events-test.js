describe('Events', function() {
  describe('GET /events', function() {
    it('returns a list of events');
  });

  describe('GET /events/:id', function() {
    it('returns the event with the correct ID');
    it('responds with a 404 NOT FOUND with a nonexistent ID');
    it('returns a list of users that have attended this event');
  });

  describe('PATCH /events/:id', function() {
    it('updates the event\'s title and description');
    it('updates the event\'s type');
    it('responds with a 404 NOT FOUND with a nonexistent ID');
  });
});
