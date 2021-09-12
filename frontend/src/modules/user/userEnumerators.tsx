import Roles from 'src/security/roles';

const userEnumerators = {
  status: ['enabled', 'disabled'],
  roles: Object.keys(Roles.values),
};

export default userEnumerators;
