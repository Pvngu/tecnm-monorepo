import { z } from 'zod';
import { FilterConfig } from '@/types/filters';
import { FormFieldConfig } from '@/types/form';

import * as AlumnosConfig from './alumnos.config';
import * as CarrerasConfig from './carreras.config';
import * as PeriodosConfig from './periodos.config';
import * as MateriasConfig from './materias.config';
import * as ProfesoresConfig from './profesores.config';
import * as GruposConfig from './grupos.config';

// Define the structure of a resource configuration
export interface ResourceConfig<T = any> {
    columns: any;
    type: T;
    includes?: string[];
    filters?: FilterConfig[];
    schema?: z.ZodTypeAny;
    formConfig?: FormFieldConfig[];
}

// Build the resource config map automatically
export const resourceConfigMap: { [key: string]: ResourceConfig } = {
    alumnos: {
        columns: AlumnosConfig.AlumnoColumns,
        type: {} as AlumnosConfig.Alumno,
        filters: AlumnosConfig.AlumnoFilters,
        schema: AlumnosConfig.AlumnoSchema,
        formConfig: AlumnosConfig.AlumnoFormConfig,
    },
    carreras: {
        columns: CarrerasConfig.CarreraColumns,
        type: {} as CarrerasConfig.Carrera,
        filters: CarrerasConfig.CarreraFilters,
        schema: CarrerasConfig.CarreraSchema,
        formConfig: CarrerasConfig.CarreraFormConfig,
    },
    periodos: {
        columns: PeriodosConfig.PeriodoColumns,
        type: {} as PeriodosConfig.Periodo,
        filters: PeriodosConfig.PeriodoFilters,
        schema: PeriodosConfig.PeriodoSchema,
        formConfig: PeriodosConfig.PeriodoFormConfig,
    },
    materias: {
        columns: MateriasConfig.MateriaColumns,
        type: {} as MateriasConfig.Materia,
        filters: MateriasConfig.MateriaFilters,
        schema: MateriasConfig.MateriaSchema,
        formConfig: MateriasConfig.MateriaFormConfig,
    },
    profesores: {
        columns: ProfesoresConfig.ProfesorColumns,
        type: {} as ProfesoresConfig.Profesor,
        filters: ProfesoresConfig.ProfesorFilters,
        schema: ProfesoresConfig.ProfesorSchema,
        formConfig: ProfesoresConfig.ProfesorFormConfig,
    },
    grupos: {
        columns: GruposConfig.GrupoColumns,
        type: {} as GruposConfig.Grupo,
        includes: GruposConfig.GrupoIncludes,
        filters: GruposConfig.GrupoFilters,
        schema: GruposConfig.GrupoSchema,
        formConfig: GruposConfig.GrupoFormConfig,
    },
};

// Export all individual configs for direct access if needed
export * from './alumnos.config';
export * from './carreras.config';
export * from './periodos.config';
export * from './materias.config';
export * from './profesores.config';
export * from './grupos.config';
