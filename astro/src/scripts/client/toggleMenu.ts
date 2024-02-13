export const menuButton = document.querySelector<HTMLButtonElement>(
  'button[data-action="toggle-menu"]',
);
export const navContainer = document.querySelector<HTMLElement>(
  '#main-menu-container',
);

export const toggleMenu = (force?: boolean) => {
  if (!navContainer) return;

  const state = navContainer.dataset?.state === 'open';
  const nextState = force === undefined ? !state : force;
  if (menuButton) menuButton.ariaPressed = nextState ? 'true' : 'false';
  navContainer.dataset.state = nextState ? 'open' : 'closed';
};
