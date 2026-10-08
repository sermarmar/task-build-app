-- Icono propio de cada grupo: nombre de un icono de lucide-react, editable desde Ajustes.
-- Hasta ahora la UI tomaba el icono de la primera categoría del grupo.

alter table public.groups add column icon text not null default 'Sparkles';

update public.groups set icon = case name
    when 'aprendizaje'   then 'GraduationCap'
    when 'bienestar'     then 'Smile'
    when 'hogar'         then 'House'
    when 'ocio'          then 'Gamepad2'
    when 'productividad' then 'Target'
    when 'salud'         then 'Heart'
    when 'social'        then 'Users'
    else icon
end;
