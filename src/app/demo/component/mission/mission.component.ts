import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Mission } from '../../domain/mission'; // Adjust path based on your actual folder structure
import { DataService } from '../../service/data.service';
import { BreadcrumbService } from 'src/app/breadcrumb.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-mission',
    templateUrl: './mission.component.html',
    styleUrls: ['./mission.component.scss'],
    providers: [MessageService, ConfirmationService]
})
export class MissionComponent implements OnInit {

    missionDialog: boolean = false;
    deleteMissionDialog: boolean = false;
    deleteMissionsDialog: boolean = false;
    mission: Mission;
    missions: Mission[] = [];
    selectedMissions: Mission[] = [];
    submitted: boolean = false;

    cols: any[] = [];
    rowsPerPageOptions = [5, 10, 20];

    installationTypes = [
        { label: 'Pro Rest', value: 'pro_resto' },
        { label: 'Pro Pat', value: 'pro_pat' },
        { label: 'Pro Mag', value: 'pro_mag' }
    ];

    constructor(
        private MissionService: DataService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private breadcrumbService: BreadcrumbService
    ) {
        this.breadcrumbService.setItems([
            { label: 'Mission', routerLink: ['/mission'] }
        ]);
    }

    ngOnInit() {
        this.loadMissions();

        this.cols = [
            { field: 'id_user', header: 'User ID' },
            { field: 'date_debut', header: 'Start Date' },
            { field: 'date_fin', header: 'End Date' },
            { field: 'nombre_installation', header: 'Installation Count' },
            { field: 'moyen', header: 'Average' },
            { field: 'type_installation', header: 'Installation Type' }
        ];
    }

    async loadMissions() {
        try {
            this.missions = await firstValueFrom(this.MissionService.getData1());
        } catch (error) {
            console.error('Error loading missions', error);
        }
    }

    openNew() {
  
      this.mission = {} as Mission;
      this.submitted = false;
      this.missionDialog = true;
    }

    deleteSelectedMissions() {
        this.deleteMissionsDialog = true;
    }

    editMission(mission: Mission) {
        this.mission = { ...mission };
        this.missionDialog = true;
    }

    deleteMission(mission: Mission) {
        this.deleteMissionDialog = true;
        this.mission = { ...mission };
    }

    confirmDelete() {

      this.deleteMissionDialog = false;
      this.MissionService.deleteData(this.mission.id).subscribe(() => {
        this.missions = this.missions.filter(val => val.id !== this.mission.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
        this.mission = {} as Mission;
      });
       
    }

    confirmDeleteSelected() {
      this.deleteMissionsDialog = false;
      this.selectedMissions.forEach(selectedMission => {
        this.MissionService.deleteData(selectedMission.id).subscribe(() => {
          this.missions = this.missions.filter(val => val.id !== selectedMission.id);
        });
      });
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
      this.selectedMissions = null;
       
    }

    hideDialog() {
        this.missionDialog = false;
        this.submitted = false;
    }

    saveMission() {
      this.submitted = true;

      if (this.mission.id.trim()) {
          if (this.mission.id) {
              this.MissionService.updateMission(this.mission.id, this.mission).subscribe(() => {
                this.missions[this.findIndexById(this.mission.id)] = this.mission;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission Updated', life: 3000 });
                this.refreshMissionList();
              });
          } else {
              this.MissionService.insertData1(this.mission).subscribe((newMission: Mission) => {
                this.missions.push(newMission);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Mission Created', life: 3000 });
                this.refreshMissionList();
              });
          }

          this.missionDialog = false;
          this.mission = {} as Mission;
      }
  }
    
  refreshMissionList() {
    this.MissionService.getData1().subscribe(data1 => this.missions = data1 as Mission[]);
}
  
  
  

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.missions.length; i++) {
            if (this.missions[i].id === id) {
                index = i;
                break;
            }
        }
        return index;
    }


    calculateAverage(installations: number, hours: number): number {
        return installations / hours;
    }

    calculateHours(startDate: Date, endDate: Date): number {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diff = end.getTime() - start.getTime();
        return diff / (1000 * 60 * 60);
    }
}