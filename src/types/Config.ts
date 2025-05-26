import Paths from './Paths.js';

interface Config extends Paths {
  appId: string;
  paths: Paths;
  withNav: boolean;
}

export default Config;
