test('basic', async (): Promise<void> => {
  try {
    const file = 'logo';
    const fragment = await import(`../../commands/${file}`);
    const logoText = fragment.default as string;
    expect(logoText.length).toBeGreaterThan(100);
  } catch (e) {
    expect(e).toMatch('error');
  }
});
