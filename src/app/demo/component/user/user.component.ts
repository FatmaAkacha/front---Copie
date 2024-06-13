import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../domain/user';
import { DataService } from '../../service/data.service';
import { BreadcrumbService } from 'src/app/breadcrumb.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  providers: [MessageService, ConfirmationService],
})
export class UserComponent implements OnInit {
  userDialog: boolean;
  deleteUserDialog: boolean = false;
  deleteUsersDialog: boolean = false;
  users: User[];
  user: User;
  selectedUsers: User[];
  submitted: boolean;
  cols: any[];
  statuses: any[];
  rowsPerPageOptions = [5, 10, 20];

  constructor(private userService: DataService, private messageService: MessageService,
              private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService) {
      this.breadcrumbService.setItems([
          { label: 'Pages' },
          { label: 'Crud', routerLink: ['/pages/crud'] }
      ]);
  }

  ngOnInit() {
      this.userService.getData().subscribe(data => this.users = data as User[]);

      this.cols = [
          { field: 'name', header: 'Name' },
          { field: 'email', header: 'Email' },
          { field: 'location', header: 'Location' },
          { field: 'specific_location', header: 'Specific Location' }
      ];

      this.statuses = [
          { label: 'INSTOCK', value: 'instock' },
          { label: 'LOWSTOCK', value: 'lowstock' },
          { label: 'OUTOFSTOCK', value: 'outofstock' }
      ];
  }

  openNew() {
      this.user = {} as User;
      this.submitted = false;
      this.userDialog = true;
  }

  deleteSelectedUsers() {
      this.deleteUsersDialog = true;
  }

  editUser(user: User) {
      this.user = { ...user };
      this.userDialog = true;
  }

  deleteUser(user: User) {
      this.deleteUserDialog = true;
      this.user = { ...user };
  }

  confirmDeleteSelected() {
      this.deleteUsersDialog = false;
      this.selectedUsers.forEach(selectedUser => {
        this.userService.deleteData(selectedUser.id).subscribe(() => {
          this.users = this.users.filter(val => val.id !== selectedUser.id);
        });
      });
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
      this.selectedUsers = null;
  }

  confirmDelete() {
      this.deleteUserDialog = false;
      this.userService.deleteData(this.user.id).subscribe(() => {
        this.users = this.users.filter(val => val.id !== this.user.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        this.user = {} as User;
      });
  }

  hideDialog() {
      this.userDialog = false;
      this.submitted = false;
  }

  saveUser() {
      this.submitted = true;

      if (this.user.name.trim()) {
          if (this.user.id) {
              this.userService.updateUser(this.user.id, this.user).subscribe(() => {
                this.users[this.findIndexById(this.user.id)] = this.user;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
              });
          } else {
              this.userService.insertData(this.user).subscribe((newUser: User) => {
                this.users.push(newUser);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Created', life: 3000 });
              });
          }

          this.users = [...this.users];
          this.userDialog = false;
          this.user = {} as User;
      }
  }

  findIndexById(id: string): number {
      let index = -1;
      for (let i = 0; i < this.users.length; i++) {
          if (this.users[i].id === id) {
              index = i;
              break;
          }
      }
      return index;
  }

  createId(): string {
      let id = '';
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < 5; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
  }
}
