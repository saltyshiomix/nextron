import path from 'path';
import execa from "execa";

const cwd = process.cwd();

export const startRendererProcess = async (rendererSrcDir:string, rendererPort:number) => {
  const renderCli = path.join(__dirname, 'render-script');
  const child = execa(
    'node',
    [renderCli, `${rendererPort}`, rendererSrcDir || 'renderer'],
    {
      cwd,
      detached: true,
    },
    );
  child.unref();
  return child;
};

if (require.main === module) {
  startRendererProcess(process.argv[2], Number(process.argv[3]));
  process.exit(0);
}
