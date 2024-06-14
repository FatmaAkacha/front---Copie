export interface Mission {
    id: any;
    id_user: number;
    date_debut: Date;
    date_fin: Date;
    nombre_installation: number;
    moyen?: number;
    type_installation: 'pro_resto' | 'pro_pat' | 'pro_mag';
  }
  