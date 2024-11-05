import sys
import pickle as pkl
import pandas as pd

def treat_bool(df, column):
    df.loc[df[column].str.strip() == 'sim', column] = '1'
    df.loc[df[column].str.strip() == 'nao', column] = '0'
    return df[column]

def treat_df(df:pd.DataFrame):
    ## coluna gender
    df.loc[~df['gender'].str.strip().isin(['feminino', 'masculino']), 'gender'] = '2'
    df.loc[df['gender'].str.strip() == 'masculino', 'gender'] = '0'
    df.loc[df['gender'].str.strip() == 'feminino', 'gender'] = '1'
    
    ## coluna has_pets
    ## coluna has_dog
    ## coluna has_cat
    ## coluna has_others
    columns = ['has_pets', 'has_dog', 'has_cat', 'has_others', 'forgets']
    for coluna in columns:
        df[coluna] = treat_bool(df, coluna)

    ## coluna report_abandoned
    df.loc[df['report_abandoned'].str.strip() == 'nao', 'report_abandoned'] = '0'
    df.loc[df['report_abandoned'].str.strip() == 'provavelmente_nao', 'report_abandoned'] = '0.25'
    df.loc[df['report_abandoned'].str.strip() == 'talvez', 'report_abandoned'] = '0.5'
    df.loc[df['report_abandoned'].str.strip() == 'provavelmente_sim', 'report_abandoned'] = '0.75'
    df.loc[df['report_abandoned'].str.strip() == 'sim', 'report_abandoned'] = '1'
    df['report_abandoned'] = df['report_abandoned'].fillna(2)

    ## coluna social_class
    df.loc[df['social_class'].str.strip() == 'menos_000', 'social_class'] = '1'
    df.loc[df['social_class'].str.strip() == 'entre_3000_7000', 'social_class'] = '2'
    df.loc[df['social_class'].str.strip() == 'entre_7000_10000', 'social_class'] = '3'
    df.loc[df['social_class'].str.strip() == 'entre_10000_22000', 'social_class'] = '4'
    df.loc[df['social_class'].str.strip() == 'mais_22000', 'social_class'] = '5'

    ## transformando as colunas em inteiro
    for column in df.columns:
        df[column] = df[column].astype(float)

    ## coluna quantity of pets
    df['number_of_pets'] = df['number_of_pets'].fillna(0)

    ## coluna feeling
    df['feeling'] = df['feeling'].fillna(3)
    
    df['feeling'] = df['feeling'] - 1

    return df

def predict(dictionary:str):
    with open('./model_user.pkl', 'rb') as file:
        model = pkl.load(file)
    
    x = {}

    for key in dictionary:
        x[key] = [dictionary[key]]

    df = treat_df(pd.DataFrame(x))

    percent = round(model.predict_proba(df)[0][1]*100, 2)
    
    return percent, percent>=50

# print(predict("{age:20,gender:Masculino,time_in_social_media:2,people_living_together:4,social_class:Entre 3000 e 7000,has_pets:Não,number_of_pets:0,has_dog:Não,has_cat:Não,has_others:Não,forgets:Não,report_abandoned:Talvez,feeling:2}", model))
