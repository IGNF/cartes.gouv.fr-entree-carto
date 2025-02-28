import ServiceBase from '@/services/ServiceBase';
import ServiceLocal from '@/services/ServiceLocal';
import ServiceRemote from '@/services/ServiceRemote';

export const serviceFactotyCreate = (options) => {
    var base = new ServiceBase(options);
    const mode = options.mode || base.mode;
    var instance;
    switch (mode) {
      case "local":
        instance = new ServiceLocal(options);
        break;
      case "remote":
        instance =  new ServiceRemote(options);
        break;
      default:
        instance = base;
        break;
    }
    return instance;
}