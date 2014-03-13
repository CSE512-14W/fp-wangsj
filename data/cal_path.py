import sys
import numpy as np

lines = open('raw_simple2.fst').read().split('\n')[1:-1]

path_num = [0]

dic = {}
dic_p = {}



def dfs(node):
    if not(node in dic):
        path_num[0] += 1
        return [path_num[0]]
    
    childs = dic[node]
    paths = []
    for i,c in enumerate(childs):
        tmp = dfs(c)
        
        path_n = (node + ' ' + c)
        if not(path_n in dic_p):
            dic_p[path_n] = []
        dic_p[path_n].extend(tmp)
        
        paths.extend(tmp)
        
    
    return paths


def pathstr(key):
    paths = dic_p[key]
    rt = '['
    for p in paths:
        rt += str(p) + ';'
    rt = rt[:-1] + ']'
    return rt


for line in lines[:-1]:
    start = line.split(' ')[0]
    end = line.split(' ')[1]
    
    if not(start in dic):
        dic[start] = []
    dic[start].append(end)
    
dfs('0')


for line in lines[:-1]:
    tokens = line.split(' ')
    print tokens[0] + ' ' + tokens[1] + pathstr(tokens[0] + ' ' + tokens[1])