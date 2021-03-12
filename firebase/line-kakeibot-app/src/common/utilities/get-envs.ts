export function getEnvs() {
  let envs: any = {};
  const envDOMs = document.querySelectorAll('env');
  for (const envDOM of envDOMs) {
    if (envDOM instanceof HTMLElement) {
      envs = {
        ...envs,
        ...envDOM.dataset,
      };
    }
  }
  return envs;
}
