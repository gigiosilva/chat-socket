import { ChatSocketPage } from './app.po';

describe('chat-socket App', () => {
  let page: ChatSocketPage;

  beforeEach(() => {
    page = new ChatSocketPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
