interface Contributor {
  name: string;
  role: string;
}

interface Module {
  name: string;
  year: number;
  units: number;
}

interface Programme {
  name: string;
  modules: Module[];
}

interface ModuleSlot {
  day: string;
  start_time: string;
  end_time: string;
  module_name: string;
  lecturer: string;
  year: number;
  units: number;
}

interface TimetableData {
  [programme: string]: ModuleSlot[];
}
