import Group from 'App/Models/Group';

export class Shared {

}

export function hasGroup (groups: Group[], groupName: string | string[]): boolean {

    console.log (groups);

    let hasMatch = false;

    if (typeof groupName !== 'string') {
        groupName.forEach (name => {
            hasMatch = internalHasGroup (groups, name);
        });
    } else {
        hasMatch = internalHasGroup (groups, groupName);
    }

    return hasMatch;
}

function internalHasGroup (groups: Group[], groupName: string): boolean {
    return groups.filter (group => group.name === groupName).length > 0;
}
