import { FormInput } from '@/components/FormComponent/FormInput';
import { FormTextbox } from '@/components/FormComponent/FormTextbox';
import PageHeader from '@/components/PageHeader';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useParams } from 'react-router-dom';
import { z } from 'zod';

const permissionsList = {
  canal: { add: 4, edit: 5, delete: 6, view: 7 },
  field: { add: 8, edit: 9, delete: 10, view: 11 },
  district: { add: 12, edit: 13, delete: 14, view: 15 },
  crops: { add: 16, edit: 17, delete: 18, view: 19 },
  customer: { add: 20, edit: 21, delete: 22, view: 23 },
} as const;

type ModuleKey = keyof typeof permissionsList;
type ActionKey = keyof (typeof permissionsList)[ModuleKey];

const permissionSchema = z.object({
  userRoleName: z.string().min(1, "Role name is required"),
  userRoleDescription: z.string().min(1, "Description is required"),
  permissions: z.array(z.number()).min(1, "Select at least one permission"),
});

type FormValues = z.infer<typeof permissionSchema>;
const initialValues: FormValues = {
  userRoleName: "",
  userRoleDescription: "",
  permissions: [],
};

const UserRoleForm = () => {
  const location = useLocation();
  const { id } = useParams();
  const form = useForm<FormValues>({
    resolver: zodResolver(permissionSchema),
    defaultValues: initialValues,
    shouldUnregister: true,
  });

  const permissions = form.watch("permissions");

  const handlePermissionChange = (module: ModuleKey, action: ActionKey, value: number, checked: boolean) => {
    let newPermissions = [...permissions];
    if (checked) {
      if (["add", "edit", "delete"].includes(action)) {
        const viewVal = permissionsList[module].view;
        if (!newPermissions.includes(viewVal)) newPermissions.push(viewVal);
      }
      if (!newPermissions.includes(value)) newPermissions.push(value);
    } else {
      newPermissions = newPermissions.filter((p) => p !== value);
      if (action === "view") {
        const { add, edit, delete: del } = permissionsList[module];
        if ([add, edit, del].some((perm) => newPermissions.includes(perm))) {
          return;
        }
      }
    }

    form.setValue("permissions", newPermissions, { shouldValidate: true });
  };

  const handleAllChange = (module: ModuleKey, checked: boolean) => {
    const allValues = Object.values(permissionsList[module]);
    let newPermissions = [...permissions];

    if (checked) {
      allValues.forEach((val) => {
        if (!newPermissions.includes(val)) newPermissions.push(val);
      });
    } else {
      newPermissions = newPermissions.filter((val) => !(allValues as number[]).includes(val));
    }

    form.setValue("permissions", newPermissions, { shouldValidate: true });
  };

  const isAllChecked = (module: ModuleKey) => {
    return Object.values(permissionsList[module]).every((val) => permissions.includes(val));
  };

  const isChecked = (val: number) => permissions.includes(val);

  const onSubmit = (data: FormValues) => {
    console.log("Form Data:", data);
  };

  return (
    <div className='h-full px-4 pt-2'>
      <PageHeader
        pageHeaderTitle={`${!id ? 'Add' : (location.pathname.includes("edit") ? "Edit" : "View")} User Role`}
        breadcrumbPathList={[
          { menuName: "Configuration", menuPath: "" },
          { menuName: "User Roles", menuPath: "/userRoles" },
        ]}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='bg-white rounded-lg shadow-md p-5 mt-3 h-auto flex flex-col gap-2 dark:bg-slate-900 dark:text-white'
        >
          <FormInput
            control={form.control}
            name='userRoleName'
            label='Role Name'
            placeholder='Enter role name'
            type='text'
            showLabel={true}
            disabled={location.pathname.includes("view")}
          />
          <FormTextbox
            control={form.control}
            name='userRoleDescription'
            label='Role Description'
            placeholder='Enter role description'
            rows={3}
            disabled={location.pathname.includes("view")}
          />

          <div className='flex flex-col gap-4 mt-2'>
            <FormLabel>Permission List</FormLabel>
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem className='max-h-64 overflow-y-auto border rounded'>
                  <div className='relative'>
                    <Table  scrollable={false} >
                      <TableHeader className='sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm'>
                        <TableRow>
                          <TableHead className='text-left'>Module</TableHead>
                          <TableHead className='text-left'>All</TableHead>
                          <TableHead className='text-left'>Add</TableHead>
                          <TableHead className='text-left'>Edit</TableHead>
                          <TableHead className='text-left'>Delete</TableHead>
                          <TableHead className='text-left'>View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Object.entries(permissionsList).map(([module, actions]) => (
                          <TableRow key={module}>
                            <TableCell className='capitalize text-left'>{module}</TableCell>
                            <TableCell className='text-left'>
                              <Checkbox
                                id={`${module}-all`}
                                checked={isAllChecked(module as ModuleKey)}
                                onCheckedChange={(checked: boolean) => handleAllChange(module as ModuleKey, checked)}
                                disabled={location.pathname.includes("view")}
                              />
                            </TableCell>
                            {(['add', 'edit', 'delete', 'view'] as ActionKey[]).map((action) => (
                              <TableCell key={action} className='text-left'>
                                <Checkbox
                                  id={`${module}-${action}`}
                                  checked={isChecked(actions[action])}
                                  onCheckedChange={(checked: boolean) =>
                                    handlePermissionChange(module as ModuleKey, action, actions[action], checked)
                                  }
                                  disabled={
                                    location.pathname.includes("view") ||
                                    (action === 'view' &&
                                      ["add", "edit", "delete"].some((a) =>
                                        permissions.includes(permissionsList[module as ModuleKey][a as ActionKey])
                                      ))
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {!location.pathname.includes("view") && (
            <Button type="submit" className="mt-4 w-fit">Add</Button>
          )}
        </form>
      </Form>
    </div>
  );
};

export default UserRoleForm;