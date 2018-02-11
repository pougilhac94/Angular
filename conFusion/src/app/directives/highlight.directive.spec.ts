import { HighlightDirective } from './highlight.directive';

describe('HighlightDirective', () => {
  it('should create an instance', () => {
    // pour eviter une erreur avec karma, la directive doit avoir 2 arguments
    //const directive = new HighlightDirective();
    const directive = new HighlightDirective(null, null);
    expect(directive).toBeTruthy();
  });
});
