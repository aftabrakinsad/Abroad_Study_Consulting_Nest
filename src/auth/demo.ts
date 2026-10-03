// Demo accounts are listed on the sign-in page, so visitors must not be able to break them
export const demoAccounts = () => ({
  admin: process.env.DEMO_EMAIL,
  manager: process.env.DEMO_MANAGER_EMAIL,
  consultant: process.env.DEMO_CONSULTANT_EMAIL,
  user: process.env.DEMO_USER_EMAIL,
});

export function isDemoAccount(email: string): boolean {
  return !!email && Object.values(demoAccounts()).includes(email);
}
